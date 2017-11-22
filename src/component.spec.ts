import {ComponentManager} from './component';

describe('Component decorator', () => {
    // TODO
});

describe('Component manager', () => {
    let componentManager: ComponentManager = new ComponentManager();

    beforeEach(() => {
        componentManager = new ComponentManager();
    });

    afterEach(() => componentManager.shutdown());

    it('can retrieve a component by type', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(componentManager.getComponent(TestComponent)).not.toBeNull();
    });

    it('instantiates a component only once', () => {
        let constructorCalls: number = 0;

        class MockComponent {
            constructor() { ++constructorCalls; }
        }

        componentManager.registerComponentClass(MockComponent);

        componentManager.getComponent(MockComponent);
        componentManager.getComponent(MockComponent);

        expect(constructorCalls).toEqual(1);
    });

    it('throws an exception when retrieving a component class that is not registered', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(() => componentManager.getComponent(TestComponent2)).toThrowError(/no component with type/);
    });

    it('can retrieve a derived component by type', () => {
        componentManager.registerComponentClass(TestDerivedComponent);

        expect(componentManager.getComponent(TestDerivedComponent)).not.toBeNull();
    });

    it('can retrieve a derived component by its base type', () => {
        componentManager.registerComponentClass(TestDerivedComponent);

        expect(componentManager.getComponent(TestComponent)).not.toBeNull();
    });

    it('throws an exception when retrieving a single component for which multiple instances exist', () => {
        componentManager.registerComponentClass(TestDerivedComponent);
        componentManager.registerComponentClass(TestDerivedComponent2);

        expect(() => componentManager.getComponent(TestComponent)).toThrowError(/multiple derived instances/);
    });

    it('can retrieve a component by identifier', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(componentManager.getComponentById('test-component')).not.toBeNull();
    });

    it('throws an exception when retrieving a component with an inexisting identifier', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(() => componentManager.getComponentById('inexisting')).toThrowError(/no component with id/);
    });

    it('can retrieve multiple instances of a base component type', () => {
        let instances: TestComponent[];

        componentManager.registerComponentClass(TestDerivedComponent);
        componentManager.registerComponentClass(TestDerivedComponent2);

        instances = componentManager.getComponents<TestComponent>(TestComponent);

        expect(instances).not.toBeNull();
        expect(instances.length).toEqual(2);
        expect(instances[0]).not.toBeNull();
        expect(Object.getPrototypeOf(instances[0]).constructor).toEqual(TestDerivedComponent);
        expect(instances[1]).not.toBeNull();
        expect(Object.getPrototypeOf(instances[1]).constructor).toEqual(TestDerivedComponent2);
    });

    it('throws an exception when retrieving components with a class that is not registered', () => {
        componentManager.registerComponentClass(TestComponent2);

        expect(() => componentManager.getComponents<TestComponent>(TestComponent)).toThrowError(/no components with type/);
    });

});

class TestComponent {

}

class TestComponent2 {
    injectedMethod(testComponent: TestComponent): void { /* Empty */ }
}

class TestDerivedComponent extends TestComponent {

}

class TestDerivedComponent2 extends TestComponent {

}
