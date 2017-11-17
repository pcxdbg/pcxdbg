
type ClassConstructorTypeFromType<T> = new (...args: any[]) => T;

/**
 * Component manager
 */
class ComponentManager {
    private static REGEXP_CONSTRUCTORPARAMS: RegExp = /constructor\(\s*([^)]+?)\s*\)/;
    private static REGEXP_METHODPARAMS: RegExp = /\(\s*([^)]+?)\s*\)/;
    private static REGEXP_PARAMETERSLIST: RegExp = /\s*,\s*/;

    private componentClasses: {[componentId: string]: Function} = {};
    private componentMethods: {[componentId: string]: string[]} = {};
    private componentInstances: {[componentId: string]: Object} = {};

    /**
     * Class constructor
     */
    constructor() {
        let componentId: string = this.buildComponentIdFromClass(ComponentManager);
        this.componentClasses[componentId] = ComponentManager;
        this.componentInstances[componentId] = this;
    }

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component class type
     */
    registerComponentClass<T extends Function>(componentClass: T): void {
        let componentId: string = this.buildComponentIdFromClass(componentClass);
        this.componentClasses[componentId] = componentClass;
    }

    /**
     * Register a component class method
     * @param componentClass Component class
     * @param methodName     Method name
     */
    registerComponentMethod<T extends Function>(componentClass: T, methodName: string): void {
        let componentId: string = this.buildComponentIdFromClass(componentClass.constructor);
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
        this.instantiateIfNecessary(componentClass);
        return <T> this.componentInstances[componentId];
    }

    /**
     * Instantiate a component if it has not been instantiated yet
     * @param componentClass Component class
     * @param <T>            Component class type
     */
    private instantiateIfNecessary<T extends Function>(componentClass: T): void {
        let componentId: string = this.buildComponentIdFromClass(componentClass);
        let constructorArgumentNames: string[];
        let constructorArguments: any[] = [];
        let constructor: new (...args: any[]) => T;
        let instance: T;

        if (componentId in this.componentInstances) {
            return;
        } else if (!(componentId in this.componentClasses)) {
            throw new Error('no component of type ' + componentClass.name + ' registered');
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
     */
    private callInjectionMethods<T extends Function>(componentClass: T, instance: T): void {
        let componentId: string = this.buildComponentIdFromClass(componentClass);
        let parentClass: Function = Object.getPrototypeOf(componentClass.prototype).constructor;
        let injectedMethods: string[] = this.componentMethods[componentId] || [];

        injectedMethods.forEach(methodName => this.callInjectionMethod(componentClass, instance, methodName));

        if (parentClass !== Object) {
            this.callInjectionMethods(parentClass, instance);
        }
    }

    /**
     * Call an injection method
     * @param componentClass Component class
     * @param instance       Instance
     * @param methodName     Method name
     * @param <T>            Component class type
     */
    private callInjectionMethod<T extends Function>(componentClass: T, instance: T, methodName: string): void {
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
            let injectedComponentClass: Function;
            let injectedComponent: Object;

            if (!(injectedComponentId in this.componentClasses)) {
                throw new Error('no matching component found for ' + className + '.' + methodName + 'argument ' + argumentName);
            }

            injectedComponentClass = this.componentClasses[injectedComponentId];
            injectedComponent = this.getComponent(<any> injectedComponentClass);
            injectedArguments.push(injectedComponent);
        });

        return injectedArguments;
    }
    /**
     * Get the list of argument names for a class' constructor
     * @param componentClass Component class
     * @param <T>            Component class type
     * @return List of argument names
     */
    private getConstructorArgumentNames<T extends Function>(componentClass: T): string[] {
        let classCode: string = componentClass.toString();
        let matches: string[] = ComponentManager.REGEXP_CONSTRUCTORPARAMS.exec(classCode);
        if (matches && matches[1]) {
            return matches[1].split(ComponentManager.REGEXP_PARAMETERSLIST);
        }

        return [];
    }

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
     * @param <T>            Component class type
     * @return Component identifier
     */
    private buildComponentIdFromClass<T extends Function>(componentClass: T): string {
        return componentClass.name.toLowerCase();
    }

    /**
     * Build a component identifier from a constructor argument name
     * @param argumentName Argument name
     * @return Component identifier
     */
    private buildComponentIdFromArgument(argumentName: string): string {
        return argumentName.toLowerCase();
    }

}

const componentManager: ComponentManager = new ComponentManager();

type ClassOrMethodDecorator = (target: Object|Function, propertyKey?: string|symbol) => void;

/**
 * Component decorator
 * @param target      Target
 * @param propertyKey Property key
 * @param descriptor  Property descriptor
 */
const Component: ClassOrMethodDecorator = (target, propertyKey) => {
    if (propertyKey) {
        componentManager.registerComponentMethod(<Function> target, <string> propertyKey);
    } else {
        componentManager.registerComponentClass(<Function> target);
    }
};

export {
    Component,
    ComponentManager,
    componentManager
};
