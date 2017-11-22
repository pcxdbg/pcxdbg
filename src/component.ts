
type ClassConstructorTypeFromType<T> = new (...args: any[]) => T;

/**
 * Component class information
 */
class ComponentClassInfo {
    componentClass: Function;
    isComponent: boolean;
    derivedComponents: string[];
}

/**
 * Component manager
 */
class ComponentManager {
    private static REGEXP_CONSTRUCTORPARAMS: RegExp = /constructor\(\s*([^)]+?)\s*\)/;
    private static REGEXP_METHODPARAMS: RegExp = /\(\s*([^)]+?)\s*\)/;
    private static REGEXP_PARAMETERSLIST: RegExp = /\s*,\s*/;
    private static REGEXP_LISTPARAMETER: RegExp = /.+List$/;
    private static SUFFIX_LISTPARAMETER: string = 'list';

    private componentClasses: {[componentId: string]: ComponentClassInfo} = {};
    private componentMethods: {[componentId: string]: string[]} = {};
    private componentInstances: {[componentId: string]: Object} = {};

    /**
     * Class constructor
     */
    constructor() {
        let componentId: string = this.buildComponentIdFromClass(ComponentManager);

        this.componentClasses[componentId] = {
            componentClass: ComponentManager,
            isComponent: true,
            derivedComponents: []
        };

        this.componentInstances[componentId] = [this];
    }

    /**
     * Shut the manager down
     */
    shutdown(): void {
        // Nothing to do
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component type
     */
    registerComponentClass<T>(componentClass: ClassConstructorTypeFromType<T>): void {
        let componentClassIterator: ClassConstructorTypeFromType<Object>;
        let componentId: string = this.buildComponentIdFromClass(componentClass);

        for (componentClassIterator = componentClass; componentClassIterator !== Object; componentClassIterator = Object.getPrototypeOf(componentClassIterator.prototype).constructor) {
            let componentIdIterator: string = this.buildComponentIdFromClass(componentClassIterator);
            let componentClassInfo: ComponentClassInfo = this.componentClasses[componentIdIterator] = this.componentClasses[componentIdIterator] || {
                componentClass: componentClassIterator,
                isComponent: componentClassIterator === componentClass,
                derivedComponents: []
            };

            if (componentClassIterator !== componentClass) {
                componentClassInfo.derivedComponents.push(componentId);
            }
        }
    }

    /**
     * Register a component class method
     * @param componentClass Component class
     * @param methodName     Method name
     * @param <T>            Component class type
     */
    registerComponentMethod<T extends Function>(componentClass: T, methodName: string): void {
        let componentId: string = this.buildComponentIdFromClass(<ClassConstructorTypeFromType<Object>> componentClass.constructor);
        let methodList: string[] = this.componentMethods[componentId] = this.componentMethods[componentId] || [];
        methodList.push(methodName);
    }

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component instance
     */
    getComponent<T>(componentClass: ClassConstructorTypeFromType<T>): T {
        let componentId: string = this.buildComponentIdFromClass(componentClass);
        let componentClassInfo: ComponentClassInfo = this.componentClasses[componentId];
        let componentInstance: Object;

        if (!componentClassInfo) {
            throw new Error('no component with type ' + componentClass.name + ' registered');
        } else if (!componentClassInfo.isComponent && componentClassInfo.derivedComponents && componentClassInfo.derivedComponents.length > 1) {
            throw new Error('unable to retrieve a component of type ' + componentClass.name + ': multiple derived instances are available');
        }

        this.instantiateIfNecessary<T>(componentClassInfo);
        componentInstance = this.componentInstances[componentId];

        return <T> componentInstance;
    }

    /**
     * Get a component by identifier
     * @param componentId Component identifier
     * @param <T>         Component type
     * @return Component instance
     */
    getComponentById<T>(componentId: string): T {
        let builtComponentId: string = this.buildComponentIdFromParameter(componentId);
        let componentClassInfo: ComponentClassInfo = this.componentClasses[builtComponentId];
        if (!componentClassInfo) {
            throw new Error('no component with id ' + componentId + ' registered');
        }

        return this.getComponent(<any> componentClassInfo.componentClass);
    }

    /**
     * Get components
     * @param componentClass Component class
     * @return Component instances
     */
    getComponents<T>(componentClass: ClassConstructorTypeFromType<T>): T[] {
        let componentClassInfo: ComponentClassInfo;
        let componentInstances: T[] = [];
        let componentInstance: T;
        let componentId: string;

        componentId = this.buildComponentIdFromClass(componentClass);
        componentClassInfo = this.componentClasses[componentId];
        if (!componentClassInfo) {
            throw new Error('no components with type ' + componentClass.name + ' registered');
        }

        if (componentClassInfo.isComponent) {
            this.instantiateIfNecessary<T>(componentClassInfo);
        }

        for (let derivedComponentId of componentClassInfo.derivedComponents) {
            componentInstance = this.getComponentById(derivedComponentId);
            componentInstances.push(componentInstance);
        }

        return componentInstances;
    }

    /**
     * Instantiate a component if it has not been instantiated yet
     * @param componentClass Component class info
     * @param <T>            Component type
     */
    private instantiateIfNecessary<T>(componentClassInfo: ComponentClassInfo): void {
        let componentClass: ClassConstructorTypeFromType<T> = <ClassConstructorTypeFromType<T>> componentClassInfo.componentClass;
        let componentId: string = this.buildComponentIdFromClass<T>(componentClass);
        let constructorArgumentNames: string[];
        let constructorArguments: any[] = [];
        let constructor: new (...args: any[]) => T;
        let instance: T;

        if (componentId in this.componentInstances) {
            return;
        }

        constructorArgumentNames = this.getConstructorArgumentNames(componentClass);
        constructorArguments = this.buildInjectedArguments(constructorArgumentNames, componentClass.name, 'constructor');

        constructor = <new (...args: any[]) => T> <any> componentClass;
        instance = new constructor(... constructorArguments);
        this.componentInstances[componentId] = instance;

        this.callInjectionMethods(componentClass, instance);
    }

    /**
     * Call injection methods on a component instancce
     * @param componentClass Component class
     * @param instance       Instance
     * @param <T>            Component type
     */
    private callInjectionMethods<T>(componentClass: ClassConstructorTypeFromType<T>, instance: T): void {
        let componentId: string = this.buildComponentIdFromClass<T>(componentClass);
        let parentClass: Function = Object.getPrototypeOf(componentClass.prototype).constructor;
        let injectedMethods: string[] = this.componentMethods[componentId] || [];

        injectedMethods.forEach(methodName => this.callInjectionMethod(componentClass, instance, methodName));

        if (parentClass !== Object) {
            this.callInjectionMethods<Object>(<ClassConstructorTypeFromType<Object>> parentClass, instance);
        }
    }

    /**
     * Call an injection method
     * @param componentClass Component class
     * @param instance       Instance
     * @param methodName     Method name
     * @param <T>            Component type
     */
    private callInjectionMethod<T>(componentClass: ClassConstructorTypeFromType<T>, instance: T, methodName: string): void {
        let method: Function = componentClass.prototype[methodName];
        let methodArgumentNames: string[] = this.getMethodArgumentNames(method);
        let methodArguments: any[] = this.buildInjectedArguments(methodArgumentNames, componentClass.name, methodName);
        method.apply(instance, methodArguments);
    }

    /**
     * Build injected arguments
     * @param argumentNames Argument names
     * @param className     Class name
     * @param methodName    Method name
     * @return List of injected instances
     */
    private buildInjectedArguments(argumentNames: string[], className: string, methodName: string): any[] {
        let injectedArguments: any[] = [];

        argumentNames.forEach(argumentName => {
            let injectedComponentId: string = this.buildComponentIdFromArgument(argumentName);
            let injectedComponentClassInfo: ComponentClassInfo = this.componentClasses[injectedComponentId];
            let isList: boolean = this.isListArgument(argumentName);
            let injectedArgument: any;

            if (!injectedComponentClassInfo) {
                throw new Error('no matching component found for ' + className + '.' + methodName + ' argument ' + argumentName + ' (component id: ' + injectedComponentId + ')');
            }

            if (isList) {
                injectedArgument = this.getComponents(<any> injectedComponentClassInfo.componentClass);
            } else if (!injectedComponentClassInfo.isComponent) {
                throw new Error('base component class ' + injectedComponentClassInfo.componentClass.name + ' cannot be injected directly');
            } else {
                injectedArgument = this.getComponent(<any> injectedComponentClassInfo.componentClass);
            }

            injectedArguments.push(injectedArgument);
        });

        return injectedArguments;
    }

    /**
     * Get the list of argument names for a class' constructor
     * @param componentClass Component class
     * @param <T>            Component type
     * @return List of argument names
     */
    private getConstructorArgumentNames<T>(componentClass: ClassConstructorTypeFromType<T>): string[] {
        let classCode: string = componentClass.toString();
        let matches: string[] = ComponentManager.REGEXP_CONSTRUCTORPARAMS.exec(classCode);
        if (matches && matches[1]) {
            return matches[1].split(ComponentManager.REGEXP_PARAMETERSLIST);
        }

        return [];
    }

    /**
     * Get the list of argument names from a method
     * @param method Method
     * @return List of argument names
     */
    private getMethodArgumentNames(method: Function): string[] {
        let matches: string[] = ComponentManager.REGEXP_METHODPARAMS.exec(method.toString());
        if (matches && matches[1]) {
            return matches[1].split(ComponentManager.REGEXP_PARAMETERSLIST);
        }

        return [];
    }

    /**
     * Build a component identifier from a component class
     * @param componentClass Component class
     * @param <T>            Component type
     * @return Component identifier
     */
    private buildComponentIdFromClass<T>(componentClass: ClassConstructorTypeFromType<T>): string {
        return componentClass.name.toLowerCase();
    }

    /**
     * Build a component identifier from a parameter name passed by callers
     * @param parameterName Parameter name
     * @return Component identifier
     */
    private buildComponentIdFromParameter(parameterName: string): string {
        return parameterName.toLowerCase().replace(/-/g, '');
    }

    /**
     * Build a component identifier from an argument name
     * @param argumentName Argument name
     * @return Component identifier
     */
    private buildComponentIdFromArgument(argumentName: string): string {
        if (this.isListArgument(argumentName)) {
            return this.buildComponentIdFromListArgument(argumentName);
        }

        return argumentName.toLowerCase();
    }

    /**
     * Build a component identifier from a list argument name
     * @param argumentName Argument name
     * @return Component identifier
     */
    private buildComponentIdFromListArgument(argumentName: string): string {
        return argumentName.toLowerCase().substring(0, argumentName.length - ComponentManager.SUFFIX_LISTPARAMETER.length);
    }

    /**
     * Test whether an argument name appears to refer to a list
     * @param argumentName Argument name
     * @return true if the argument appears to be a list
     */
    private isListArgument(argumentName: string): boolean {
        return ComponentManager.REGEXP_LISTPARAMETER.test(argumentName);
    }

}

const componentManager: ComponentManager = new ComponentManager();

type ClassOrMethodDecorator = (target: Object|Function, propertyKey?: string|symbol) => void;

/**
 * Component decorator
 * @param target      Target
 * @param propertyKey Property key
 */
const Component: ClassOrMethodDecorator = (target, propertyKey) => {
    if (propertyKey) {
        componentManager.registerComponentMethod(<Function> target, <string> propertyKey);
    } else {
        componentManager.registerComponentClass(<Function> target);
    }
};

export {
    ClassConstructorTypeFromType,
    Component,
    ComponentManager,
    componentManager
};
