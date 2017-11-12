
/**
 * Component decorator
 * @param target Target class
 */
const Component: ClassDecorator = targetClass => ComponentManager.registerComponentClass(targetClass);

/**
 * Component manager
 */
class ComponentManager {
    private static REGEXP_CONSTRUCTORPARAMS: RegExp = /constructor\(\s*([^)]+?)\s*\)/;
    private static REGEXP_CONSTRUCTORPAAMSLIST: RegExp = /\s*,\s*/;
    private static COMPONENT_CLASSES: {[componentId: string]: Function} = {};
    private static COMPONENT_INSTANCES: {[componentId: string]: Object} = {};

    /**
     * Register a component class
     * @param componentClass Component class
     * @param <T>            Component class type
     */
    static registerComponentClass<T extends Function>(componentClass: T): void {
        let componentId: string = ComponentManager.buildComponentIdFromClass(componentClass);
        ComponentManager.COMPONENT_CLASSES[componentId] = componentClass;
    }

    /**
     * Get a component
     * @param componentClass Component class
     * @param <T>            Component class type
     * @return Component instance
     */
    static getComponent<T extends Function>(componentClass: T): T {
        let componentId: string = ComponentManager.buildComponentIdFromClass(componentClass);
        ComponentManager.instantiateIfNecessary(componentClass);
        return <T> ComponentManager.COMPONENT_INSTANCES[componentId];
    }

    /**
     * Instantiate a component if it has not been instantiated yet
     * @param componentClass Component class
     * @param <T>            Component class type
     */
    private static instantiateIfNecessary<T extends Function>(componentClass: T): void {
        let componentId: string = ComponentManager.buildComponentIdFromClass(componentClass);
        let constructorArgumentNames: string[];
        let constructorArguments: any[] = [];
        let constructor: {new (...args: any[]): T};

        if (componentId in ComponentManager.COMPONENT_INSTANCES) {
            return;
        } else if (!(componentId in ComponentManager.COMPONENT_CLASSES)) {
            throw new Error('no component of type ' + componentClass.name + ' registered');
        }

        ComponentManager.getConstructorArgumentNames(componentClass).forEach(constructorArgumentName => {
            let injectedComponentId: string = ComponentManager.buildComponentIdFromArgument(constructorArgumentName);
            let injectedComponentClass: Function;
            let injectedComponent: Object;

            if (!(injectedComponentId in ComponentManager.COMPONENT_CLASSES)) {
                throw new Error('no matching component found for ' + componentClass.name + ' constructor argument ' + constructorArgumentName);
            }

            injectedComponentClass = ComponentManager.COMPONENT_CLASSES[injectedComponentId];
            injectedComponent = ComponentManager.getComponent(injectedComponentClass);
            constructorArguments.push(injectedComponent);
        });

        constructor = <{new (...args: any[]): T}> <any> componentClass;

        ComponentManager.COMPONENT_INSTANCES[componentId] = new constructor(... constructorArguments);
    }

    /**
     * Get the list of argument names for a class' constructor
     * @param componentClass Component class
     * @param <T>            Component class type
     * @return List of argument names
     */
    private static getConstructorArgumentNames<T extends Function>(componentClass: T): string[] {
        let classCode: string = componentClass.toString();
        let matches: string[] = ComponentManager.REGEXP_CONSTRUCTORPARAMS.exec(classCode);
        if (matches && matches[1]) {
            return matches[1].split(ComponentManager.REGEXP_CONSTRUCTORPAAMSLIST);
        }

        return [];
    }

    /**
     * Build a component identifier from a component class
     * @param componentClass Component class
     * @param <T>            Component class type
     * @return Component identifier
     */
    private static buildComponentIdFromClass<T extends Function>(componentClass: T): string {
        return componentClass.name.toLowerCase();
    }

    /**
     * Build a component identifier from a constructor argument name
     * @param argumentName Argument name
     * @return Component identifier
     */
    private static buildComponentIdFromArgument(argumentName: string): string {
        return argumentName.toLowerCase();
    }

}

export {
    Component,
    ComponentManager
};
