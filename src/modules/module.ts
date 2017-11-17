
/**
 * Module information
 */
class ModuleInformation {
    name: string;
    description: string;
    version: string;
}

/**
 * Module interface
 */
interface Module {

    /**
     * Get the module name
     * @return Module name
     */
    getInformation(): Promise<ModuleInformation>;

}

export {
    Module,
    ModuleInformation
};
