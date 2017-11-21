import {ComponentManager} from './component';

describe('Component decorator', () => {

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

        expect(() => componentManager.getComponent(TestComponent)).toThrowError(/multiple instances/);
    });

    it('can retrieve a component by identifier', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(componentManager.getComponentById('test-component')).not.toBeNull();
    });

    it('throws an exception when retrieving a component with an inexisting identifier', () => {
        componentManager.registerComponentClass(TestComponent);

        expect(() => componentManager.getComponentById('inexisting')).toThrowError(/no component with id/);
    });

});

class TestComponent {

}

class TestDerivedComponent extends TestComponent {

}

class TestDerivedComponent2 extends TestComponent {

}
