type ClassConstructorTypeFromType<T> = new (...args: any[]) => T;

enum ScopeType {
    PROTOTYPE,
    SINGLETON
}

/**
 * Component class information
 */
class ComponentClassInfo {
    componentClass: Function;
    isComponent: boolean;
    derivedComponents: string[];
    scopeType: ScopeType;
}

/**
 * Component manager
 */
class ApplicationContext {
    private static REGEXP_CONSTRUCTORPARAMS: RegExp = /constructor\(\s*([^)]+?)\s*\)/;
    private static REGEXP_METHODPARAMS: RegExp = /\(\s*([^)]+?)\s*\)/;
    private static REGEXP_PARAMETERSLIST: RegExp = /\s*,\s*/;
    private static REGEXP_LISTPARAMETER: RegExp = /(.+List)$|(\.\.\..+s?)$/;
    private static REGEXP_LISTPARAMETER_PREFIX: RegExp = /^\.\.\.[\s]*(.+)$/;
    private static REGEXP_LISTPARAMETER_SUFFIX: RegExp = /^(.+)list$/;

    private componentClasses: {[componentId: string]: ComponentClassInfo} = {};
    private componentMethods: {[componentId: string]: string[]} = {};
    private componentPostConstructs: {[componentId: string]: string[]} = {};
    private componentInstances: {[componentId: string]: Object} = {};

    /**
     * Class constructor
     */
    constructor() {
        let componentId: string = this.buildComponentIdFromClass(ApplicationContext);

        this.componentClasses[componentId] = {
            componentClass: ApplicationContext,
            isComponent: true,
            scopeType: ScopeType.SINGLETON,
            derivedComponents: []
        };

        this.componentInstances[componentId] = this;
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
                scopeType: ScopeType.SINGLETON,
                derivedComponents: []
            };

            if (componentClassIterator !== componentClass) {
                componentClassInfo.derivedComponents.push(componentId);
            }
        }
    }

    /**
     * Register a component class method
     * @param componentPrototype Component prototype
     * @param methodName         Method name
     * @param <T>                Component prototype type
     */
    registerComponentMethod<T extends Object>(componentPrototype: T, methodName: string): void {
        let componentId: string = this.buildComponentIdFromClass(<ClassConstructorTypeFromType<Object>> componentPrototype.constructor);
        let methodList: string[] = this.componentMethods[componentId] = this.componentMethods[componentId] || [];
        methodList.push(methodName);
    }

    registerPostConstruct<T extends Object>(componentPrototype: T, methodName: string): void {
        let componentId: string = this.buildComponentIdFromClass(<ClassConstructorTypeFromType<Object>> componentPrototype.constructor);
        let methodList: string[] = this.componentPostConstructs[componentId] = this.componentPostConstructs[componentId] || [];
        methodList.push(methodName);
    }

    /**
     * Set a component scope type
     * @param componentClass Component class
     * @param <T>            Component type
     */
    setComponentScope<T>(componentClass: ClassConstructorTypeFromType<T>, scopeType: ScopeType): void {
        this.registerComponentClass(componentClass);
        let componentId: string = this.buildComponentIdFromClass(componentClass);
        this.componentClasses[componentId].scopeType = scopeType;
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

        componentInstance = this.instantiateIfNecessary<T>(componentClassInfo);

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
            componentInstance = this.getComponent<T>(componentClass);
            componentInstances.push(componentInstance);
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
     * @return Instance
     */
    private instantiateIfNecessary<T>(componentClassInfo: ComponentClassInfo): T {
        let componentClass: ClassConstructorTypeFromType<T> = <ClassConstructorTypeFromType<T>> componentClassInfo.componentClass;
        let componentId: string = this.buildComponentIdFromClass<T>(componentClass);
        let constructorArgumentNames: string[];
        let constructorArguments: any[] = [];
        let constructor: new (...args: any[]) => T;
        let instance: T;

        if (componentId in this.componentInstances) {
            return <T> this.componentInstances[componentId];
        }

        constructorArgumentNames = this.getConstructorArgumentNames(componentClass);
        constructorArguments = this.buildInjectedArguments(constructorArgumentNames, componentClass.name, 'constructor');

        constructor = <new (...args: any[]) => T> <any> componentClass;
        instance = new constructor(... constructorArguments);

        if (componentClassInfo.scopeType === ScopeType.SINGLETON) {
            this.componentInstances[componentId] = instance;
        }

        this.callInjectionMethods(componentClass, instance);
        this.callPostConstructMethods(componentClass, instance);

        return instance;
    }

    private callPostConstructMethods<T>(componentClass: ClassConstructorTypeFromType<T>, instance: T): void {
        let componentId: string = this.buildComponentIdFromClass<T>(componentClass);
        let parentClass: Function = Object.getPrototypeOf(componentClass.prototype).constructor;
        let postConstructMethods: string[] = this.componentPostConstructs[componentId] || [];

        postConstructMethods.forEach(methodName => this.callPostConstructMethod(componentClass, instance, methodName));

        if (parentClass !== Object) {
            this.callPostConstructMethods<Object>(<ClassConstructorTypeFromType<Object>> parentClass, instance);
        }
    }

    private callPostConstructMethod<T>(componentClass: ClassConstructorTypeFromType<T>, instance: T, methodName: string): void {
        let method: Function = componentClass.prototype[methodName];
        method.apply(instance);
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

            if (!injectedComponentClassInfo) {
                throw new Error('no matching component found for ' + className + '.' + methodName + ' argument ' + argumentName + ' (component id: ' + injectedComponentId + ')');
            }

            this.addInjectedArgument(injectedArguments, argumentName, injectedComponentId, injectedComponentClassInfo);
        });

        return injectedArguments;
    }

    /**
     * Add an injected argument in preparation for a method call
     * @param injectedArguments          Injected argument list
     * @param argumentName               Argument name
     * @param injectedComponentId        Injected component identifier
     * @param injectedComponentClassInfo Injected component class information
     */
    private addInjectedArgument(injectedArguments: any[], argumentName: string, injectedComponentId: string, injectedComponentClassInfo: ComponentClassInfo): void {
        let isList: boolean = this.isListArgument(argumentName);
        let injectedArgument: any;
        let injectedArgumentList: Object[];

        if (isList) {
            injectedArgument = injectedArgumentList = this.getComponents(<any> injectedComponentClassInfo.componentClass);
        } else if (!injectedComponentClassInfo.isComponent) {
            if (injectedComponentClassInfo.derivedComponents.length > 1) {
                throw new Error('base component class ' + injectedComponentClassInfo.componentClass.name + ' cannot be injected directly as multiple instances are available');
            } else {
                injectedArgument = this.getComponentById(injectedComponentClassInfo.derivedComponents[0]);
            }
        } else {
            injectedArgument = this.getComponent(<any> injectedComponentClassInfo.componentClass);
        }

        if (isList && this.isSpreadListArgument(argumentName)) {
            for (let spreadElement of injectedArgumentList) {
                injectedArguments.push(spreadElement);
            }
        } else {
            injectedArguments.push(injectedArgument);
        }
    }

    /**
     * Get the list of argument names for a class' constructor
     * @param componentClass Component class
     * @param <T>            Component type
     * @return List of argument names
     */
    private getConstructorArgumentNames<T>(componentClass: ClassConstructorTypeFromType<T>): string[] {
        let classCode: string = componentClass.toString();
        let matches: string[] = ApplicationContext.REGEXP_CONSTRUCTORPARAMS.exec(classCode);
        if (matches && matches[1]) {
            return matches[1].split(ApplicationContext.REGEXP_PARAMETERSLIST);
        }

        return [];
    }

    /**
     * Get the list of argument names from a method
     * @param method Method
     * @return List of argument names
     */
    private getMethodArgumentNames(method: Function): string[] {
        let matches: string[] = ApplicationContext.REGEXP_METHODPARAMS.exec(method.toString());
        if (matches && matches[1]) {
            return matches[1].split(ApplicationContext.REGEXP_PARAMETERSLIST);
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
        let componentId = argumentName.toLowerCase();
        let matches: string[];

        matches = componentId.match(ApplicationContext.REGEXP_LISTPARAMETER_PREFIX);
        if (matches) {
            componentId = matches[1];
            if (componentId.charAt(componentId.length - 1) === 's') {
                componentId = componentId.substr(0, componentId.length - 1);
            }
        }

        matches = componentId.match(ApplicationContext.REGEXP_LISTPARAMETER_SUFFIX);
        if (matches) {
            componentId = matches[1];
        }

        return componentId;
    }

    /**
     * Test whether an argument name appears to refer to a list
     * @param argumentName Argument name
     * @return true if the argument appears to be a list
     */
    private isListArgument(argumentName: string): boolean {
        return ApplicationContext.REGEXP_LISTPARAMETER.test(argumentName);
    }

    /**
     * Test whether an argument name appears to refer to a list using the spread operator
     * @param argumentName Argument name
     */
    private isSpreadListArgument(argumentName: string): boolean {
        return ApplicationContext.REGEXP_LISTPARAMETER_PREFIX.test(argumentName);
    }

}

const applicationContext: ApplicationContext = new ApplicationContext();

type ClassOrMethodDecorator = (target: Object|Function, propertyKey?: string|symbol) => void;

const Component: ClassDecorator = target => applicationContext.registerComponentClass(<ClassConstructorTypeFromType<Object>> <any> target);
const Controller: ClassDecorator = Component;
const Repository: ClassDecorator = Controller;
const Service: ClassDecorator = Controller;
const Inject: MethodDecorator = (target, propertyKey) => applicationContext.registerComponentMethod(target, <string> propertyKey);
const PostConstruct: MethodDecorator = (target, propertyKey) => applicationContext.registerPostConstruct(target, <string> propertyKey);
const PreDestroy: MethodDecorator = () => { /* Nothing */ };

function Order(index: number): MethodDecorator {
    return (target, propertyKey) => { /* Nothing */ };
}

function Scope(scopeType: ScopeType): ClassDecorator {
    return target => applicationContext.setComponentScope(<ClassConstructorTypeFromType<Object>> <any> target, scopeType);
}

export {
    ApplicationContext,
    applicationContext,
    ClassConstructorTypeFromType,
    Component,
    Controller,
    Inject,
    Order,
    PostConstruct,
    PreDestroy,
    Repository,
    Scope,
    ScopeType,
    Service
};
