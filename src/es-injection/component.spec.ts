import {ApplicationContext} from './component';

class TestComponent { }
class TestComponent2 { }
class TestDerivedComponent extends TestComponent { }
class TestDerivedComponent2 extends TestComponent { }

describe('Application context', () => {
    let applicationContext: ApplicationContext;

    beforeEach(() => {
        applicationContext = new ApplicationContext();
    });

    afterEach(() => {
        applicationContext.shutdown();
    });

    describe('can retrieve', () => {

        describe('a single instance', () => {

            it('by type', () => {
                // Given
                applicationContext.registerComponentClass(TestComponent);
                // When
                let testComponent: TestComponent = applicationContext.getComponent(TestComponent);
                // Then
                expect(testComponent).not.toBeNull();
            });

            it('by identifier', () => {
                // Given
                applicationContext.registerComponentClass(TestComponent);
                // When
                let testComponent: TestComponent = applicationContext.getComponentById<TestComponent>('test-component');
                // Then
                expect(testComponent).not.toBeNull();
                expect(Object.getPrototypeOf(testComponent).constructor).toEqual(TestComponent);
            });

            it('only instantiating it once', () => {
                // Given
                let constructorCalls: number = 0;
                class MockComponent { constructor() { ++constructorCalls; } }
                applicationContext.registerComponentClass(MockComponent);
                // When
                applicationContext.getComponent(MockComponent);
                applicationContext.getComponent(MockComponent);
                // Then
                expect(constructorCalls).toEqual(1);
            });

            it('when it is a derived type', () => {
                // Given
                applicationContext.registerComponentClass(TestDerivedComponent);
                // When
                let testDerivedComponent: TestDerivedComponent = applicationContext.getComponent(TestDerivedComponent);
                // Then
                expect(testDerivedComponent).not.toBeNull();
            });

            /* Not needed at this point anyway, will be fixed in the separate injection library
            it('when it is a derived type, using its base type', () => {
                // Given
                applicationContext.registerComponentClass(TestDerivedComponent);
                // When
                let testComponent: TestComponent = applicationContext.getComponent(TestComponent);
                // Then
                expect(testComponent).not.toBeNull();
                expect(Object.getPrototypeOf(testComponent).constructor).toEqual(TestDerivedComponent);
            });*/

        });

        describe('multiple instances', () => {

            it('by base type', () => {
                // Given
                applicationContext.registerComponentClass(TestDerivedComponent);
                applicationContext.registerComponentClass(TestDerivedComponent2);
                // When
                let instances: TestComponent[] = applicationContext.getComponents<TestComponent>(TestComponent);
                // Then
                expect(instances).not.toBeNull();
                expect(instances.length).toEqual(2);
                expect(instances[0]).not.toBeNull();
                expect(Object.getPrototypeOf(instances[0]).constructor).toEqual(TestDerivedComponent);
                expect(instances[1]).not.toBeNull();
                expect(Object.getPrototypeOf(instances[1]).constructor).toEqual(TestDerivedComponent2);
            });

            it('by base type, including the base instance', () => {
                // Given
                applicationContext.registerComponentClass(TestComponent);
                applicationContext.registerComponentClass(TestDerivedComponent);
                // When
                let instances: TestComponent[] = applicationContext.getComponents<TestComponent>(TestComponent);
                // Then
                expect(instances).not.toBeNull();
                expect(instances.length).toEqual(2);
                expect(instances[0]).not.toBeNull();
                expect(Object.getPrototypeOf(instances[0]).constructor).toEqual(TestComponent);
                expect(instances[1]).not.toBeNull();
                expect(Object.getPrototypeOf(instances[1]).constructor).toEqual(TestDerivedComponent);
            });

        });

    });

    describe('can inject', () => {

        it('a constructor argument', () => {
            // Given
            class MockComponent { testComponent: TestComponent; constructor(testComponent: TestComponent) { this.testComponent = testComponent; } }
            applicationContext.registerComponentClass(TestComponent);
            applicationContext.registerComponentClass(MockComponent);
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testComponentInstance: TestComponent = applicationContext.getComponent(TestComponent);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponent).toEqual(testComponentInstance);
        });

        it('a method argument', () => {
            // Given
            class MockComponent { testComponent: TestComponent; injectedMethod(testComponent: TestComponent): void { this.testComponent = testComponent; } }
            applicationContext.registerComponentClass(TestComponent);
            applicationContext.registerComponentClass(MockComponent);
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testComponentInstance: TestComponent = applicationContext.getComponent(TestComponent);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponent).toEqual(testComponentInstance);
        });

        it('a constructor list argument', () => {
            // Given
            class MockComponent { testComponentList: TestComponent[]; constructor(testComponentList: TestComponent[]) { this.testComponentList = testComponentList; } }
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(TestDerivedComponent2);
            applicationContext.registerComponentClass(MockComponent);
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testDerivedComponent: TestDerivedComponent = applicationContext.getComponent(TestDerivedComponent);
            let testDerivedComponent2: TestDerivedComponent2 = applicationContext.getComponent(TestDerivedComponent2);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponentList).not.toBeNull();
            expect(mockComponent.testComponentList.length).toEqual(2);
            expect(mockComponent.testComponentList[0]).not.toBeNull();
            expect(mockComponent.testComponentList[0]).toEqual(testDerivedComponent);
            expect(mockComponent.testComponentList[1]).not.toBeNull();
            expect(mockComponent.testComponentList[1]).toEqual(testDerivedComponent2);
        });

        it('a method list argument', () => {
            // Given
            class MockComponent { testComponentList: TestComponent[]; injectedMethod(testComponentList: TestComponent[]): void { this.testComponentList = testComponentList; } }
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(TestDerivedComponent2);
            applicationContext.registerComponentClass(MockComponent);
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testDerivedComponent: TestDerivedComponent = applicationContext.getComponent(TestDerivedComponent);
            let testDerivedComponent2: TestDerivedComponent2 = applicationContext.getComponent(TestDerivedComponent2);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponentList).not.toBeNull();
            expect(mockComponent.testComponentList.length).toEqual(2);
            expect(mockComponent.testComponentList[0]).not.toBeNull();
            expect(mockComponent.testComponentList[0]).toEqual(testDerivedComponent);
            expect(mockComponent.testComponentList[1]).not.toBeNull();
            expect(mockComponent.testComponentList[1]).toEqual(testDerivedComponent2);
        });

        it('a method spread argument', () => {
            // Given
            class MockComponent { testComponents: TestComponent[]; injectedMethod(...testComponents: TestComponent[]): void { this.testComponents = testComponents; } }
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(TestDerivedComponent2);
            applicationContext.registerComponentClass(MockComponent);
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testDerivedComponent: TestDerivedComponent = applicationContext.getComponent(TestDerivedComponent);
            let testDerivedComponent2: TestDerivedComponent2 = applicationContext.getComponent(TestDerivedComponent2);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponents).not.toBeNull();
            expect(mockComponent.testComponents.length).toEqual(2);
            expect(mockComponent.testComponents[0]).not.toBeNull();
            expect(mockComponent.testComponents[0]).toEqual(testDerivedComponent);
            expect(mockComponent.testComponents[1]).not.toBeNull();
            expect(mockComponent.testComponents[1]).toEqual(testDerivedComponent2);
        });

        it('a method base class argument', () => {
            // Given
            class MockComponent { testComponent: TestComponent; injectedMethod(testComponent: TestComponent): void { this.testComponent = testComponent; } }
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(MockComponent);
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            let testDerivedComponent: TestDerivedComponent = applicationContext.getComponent(TestDerivedComponent);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.testComponent).not.toBeNull();
            expect(mockComponent.testComponent).toEqual(testDerivedComponent);
            expect(Object.getPrototypeOf(mockComponent.testComponent).constructor).toEqual(TestDerivedComponent);
        });

        it('a method with no arguments', () => { // TODO: update once @PostConstruct is defined: this should occur after all other injections
            // Given
            class MockComponent { called: boolean; injectedMethod(): void { this.called = true; } }
            applicationContext.registerComponentClass(MockComponent);
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // When
            let mockComponent: MockComponent = applicationContext.getComponent(MockComponent);
            // Then
            expect(mockComponent).not.toBeNull();
            expect(mockComponent.called).toEqual(true);
        });

    });

    describe('throws an exception when retrieving', () => {

        it('a component class that is not registered', () => {
            // When
            applicationContext.registerComponentClass(TestComponent);
            // Then
            expect(() => applicationContext.getComponent(TestComponent2)).toThrowError(/no component with type/);
        });

        it('a single component for which multiple instances exist', () => {
            // When
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(TestDerivedComponent2);
            // Then
            expect(() => applicationContext.getComponent(TestComponent)).toThrowError(/multiple derived instances/);
        });

        it('a component with an inexisting identifier', () => {
            // Given
            applicationContext.registerComponentClass(TestComponent);
            // Then
            expect(() => applicationContext.getComponentById('inexisting')).toThrowError(/no component with id/);
        });

        it('components with a class that is not registered', () => {
            // When
            applicationContext.registerComponentClass(TestComponent);
            // Then
            expect(() => applicationContext.getComponents<TestComponent>(TestComponent2)).toThrowError(/no components with type/);
        });

    });

    describe('throws an exception when injecting', () => {

        it('an unknown component into a method', () => {
            // Given
            class MockComponent { injectedMethod(testComponent: TestComponent): void { /* Empty */ } }
            applicationContext.registerComponentClass(MockComponent);
            // When
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // Then
            expect(() => applicationContext.getComponent(MockComponent)).toThrowError(/no matching component found/);
        });

        it('a base component class with multiple derived instances', () => {
            // Given
            class MockComponent { injectedMethod(testComponent: TestComponent): void { /* Empty */ } }
            applicationContext.registerComponentClass(TestDerivedComponent);
            applicationContext.registerComponentClass(TestDerivedComponent2);
            applicationContext.registerComponentClass(MockComponent);
            // When
            applicationContext.registerComponentMethod(Object.getPrototypeOf(new MockComponent()), 'injectedMethod');
            // Then
            expect(() => applicationContext.getComponent(MockComponent)).toThrowError(/cannot be injected directly as multiple instances are available/);
        });

    });

});
