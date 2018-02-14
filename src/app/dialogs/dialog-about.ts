import {remote} from 'electron';
import {I18nManager} from 'i18n';
import {Button, Icon, IconManager, List, ListItemDefinition, ModalStyle, ModalView, UIElement, UIElementBase} from 'ui';
import {FileUtils, NodePackage} from 'utils';
import {Component, Inject} from 'es-injection';

/**
 * Version information
 */
class VersionInformation {
    name: string;
    value: string;
    parameters: {[parameterName: string]: any};
}

/**
 * Dependency version information
 */
class DependencyInformation {
    name: string;
    version: string;
    license: string;
    description: string;
    url: string;
}

/**
 * About dialog box
 */
@Component
class AboutDialog extends ModalView {
    private static HTML: string = `
        <about-logo>
            <about-logo-name i18n="app:dialog.about.name"></about-logo-name>
        </about-logo>
        <about-content>
            <version-info-list></version-info-list>
            <dependency-list></dependency-list>
            <about-close></about-close>
        </about-content>
    `;

    private i18nManager: I18nManager;
    private iconManager: IconManager;
    private fileUtils: FileUtils;
    private versionApplication: string;
    private versionChrome: string;
    private versionElectron: string;
    private versionNode: string;
    private versionOpenSSL: string;
    private versionV8: string;
    private revisionId: string;
    private revisionNumber: string;
    private buildDate: Date;

    /**
     * Class constructor
     */
    constructor() {
        super(ModalStyle.NO_BORDER, ModalStyle.NO_CONTROLS, ModalStyle.NO_TITLE);
        this.versionApplication = remote.app.getVersion();
        this.versionChrome = remote.process.versions.chrome;
        this.versionElectron = remote.process.versions.electron;
        this.versionNode = remote.process.versions.node;
        this.versionOpenSSL = remote.process.versions.openssl;
        this.versionV8 = remote.process.versions.v8;
        this.revisionId = process.env.REVISION_ID;
        this.revisionNumber = process.env.REVISION_NUMBER;
        this.buildDate = new Date(process.env.BUILD_TIME);
    }

    /**
     * Set the i18n manager
     * @param i18nManager i18n manager
     */
    @Inject
    setI18nManager(i18nManager: I18nManager): void {
        this.i18nManager = i18nManager;
    }

    /**
     * Set the icon manager
     * @param iconManager Icon manager
     */
    @Inject
    setIconManager(iconManager: IconManager): void {
        this.iconManager = iconManager;
    }

    /**
     * Set the file utility functions
     * @param fileUtils File utility functions
     */
    @Inject
    setFileUtils(fileUtils: FileUtils): void {
        this.fileUtils = fileUtils;
    }

    /**
     * Build the modal content
     */
    protected async buildModalContent(): Promise<void> {
        let dialogElement: UIElement = new UIElementBase('about-dialog', AboutDialog.HTML);
        let versionInfoBlock: UIElement = dialogElement.element('about-content', 'version-info-list');
        let versionInfoList: VersionInformation[] = this.prepareVersionInformationList();
        let dependencyList: List<DependencyInformation> = await this.buildDependencyList();
        let closeButton: Button = new Button();

        versionInfoList.forEach(versionInfo => this.createVersionInformationElement(versionInfo).attachTo(versionInfoBlock));

        closeButton
            .label('ui:modal.control.close')
            .click(() => this.close())
        ;

        dialogElement.element('about-logo').applyTranslations().attach(this.iconManager.createIcon(64, 64, 'title-bar-logo'));
        dialogElement.element('about-content', 'dependency-list').attach(dependencyList);
        dialogElement.element('about-content', 'about-close').attach(closeButton);

        this.attach(dialogElement);
    }

    /**
     * Create a version information element
     * @param versionInfo Version information
     * @return Element
     */
    private createVersionInformationElement(versionInfo: VersionInformation): UIElement {
        let versionInfoElement: UIElement = new UIElementBase('version-info');
        versionInfoElement.i18n(versionInfo.value, versionInfo.parameters).applyTranslations();
        versionInfoElement.class(versionInfo.name);
        return versionInfoElement;
    }

    /**
     * Prepare version information for display
     * @return List of version information
     */
    private prepareVersionInformationList(): VersionInformation[] {
        return [
            this.prepareApplicationVersionInformation(),
            this.prepareRevisionVersionInformation(),
            this.prepareBuildVersionInformation(),
            this.prepareElectronVersionInformation(),
            this.prepareNodeVersionInformation()
        ];
    }

    /**
     * Prepare application version information for display
     * @return Application version information
     */
    private prepareApplicationVersionInformation(): VersionInformation {
        return {
            name: 'app',
            value: 'app:dialog.about.version.application.label',
            parameters: {
                'version': this.versionApplication
            }
        };
    }

    /**
     * Prepare revision version information for display
     * @return Revision version information
     */
    private prepareRevisionVersionInformation(): VersionInformation {
        return {
            name: 'revision',
            value: 'app:dialog.about.version.revision.label',
            parameters: {
                'revisionId': this.revisionId,
                'revisionNumber': this.revisionNumber
            }
        };
    }

    /**
     * Prepare build version information for display
     * @return Build version information
     */
    private prepareBuildVersionInformation(): VersionInformation {
        return {
            name: 'build',
            value: 'app:dialog.about.version.build.label',
            parameters: {
                'buildDate': this.i18nManager.formatDate(this.buildDate, 'LL')
            }
        };
    }

    /**
     * Prepare Electron version information for display
     * @return Electron version information
     */
    private prepareElectronVersionInformation(): VersionInformation {
        return {
            name: 'electron',
            value: 'app:dialog.about.version.electron.label',
            parameters: {
                'versionElectron': this.versionElectron,
                'versionChrome': this.versionChrome
            }
        };
    }

    /**
     * Prepare Node version information for display
     * @return Node version information
     */
    private prepareNodeVersionInformation(): VersionInformation {
        return {
            name: 'node',
            value: 'app:dialog.about.version.node.label',
            parameters: {
                'versionNode': this.versionNode,
                'versionV8': this.versionV8,
                'versionOpenSSL': this.versionOpenSSL
            }
        };
    }

    /**
     * Build the dependency list
     * @return Dependency list
     */
    private async buildDependencyList(): Promise<List<DependencyInformation>> {
        let dependencies: DependencyInformation[] = await this.buildDependenciesInformation();
        let itemDefinition: ListItemDefinition<DependencyInformation>;
        let list: List<DependencyInformation> = new List<DependencyInformation>();

        list.addColumns({
            id: 'name',
            label: 'app:dialog.about.dependencies.column.name'
        }, {
            id: 'version',
            label: 'app:dialog.about.dependencies.column.version'
        }, {
            id: 'license',
            label: 'app:dialog.about.dependencies.column.license'
        });

        itemDefinition = {
            provider: (item, row) => row.attribute('title', item.description)
        };

        dependencies.forEach(dependency => list.addItem(dependency, itemDefinition));

        return list;
    }

    /**
     * Build the list of dependency information
     * @return Promise that resolves to the list of dependency information
     */
    private async buildDependenciesInformation(): Promise<DependencyInformation[]> {
        let dependencyNames: string[] = await this.getDependencyNames();
        let dependencies: DependencyInformation[] = [];

        for (let dependencyName of dependencyNames) {
            let dependencyInformation: DependencyInformation = await this.buildDependencyInformation(dependencyName);
            dependencies.push(dependencyInformation);
        }

        return dependencies;
    }

    /**
     * Build dependency information for a specific dependency
     * @param dependencyName Dependency name
     * @return Dependency information
     */
    private async buildDependencyInformation(dependencyName: string): Promise<DependencyInformation> {
        let dependencyInformation: DependencyInformation = new DependencyInformation();
        let packageData: NodePackage = await this.fileUtils.getModulePackage(dependencyName);

        dependencyInformation.name = packageData.name;
        dependencyInformation.version = packageData.version;
        dependencyInformation.description = packageData.description;
        dependencyInformation.license = packageData.license;
        dependencyInformation.url = packageData.homepage;

        return dependencyInformation;
    }

    /**
     * Get all the dependencies
     * @return List of dependencies
     */
    private async getDependencyNames(): Promise<string[]> {
        let packageData: NodePackage = await this.fileUtils.getApplicationPackage();
        let dependencies: {[dependencyName: string]: string} = packageData.dependencies;
        let dependencyNames: string[] = [];

        for (let dependencyName in dependencies) {
            dependencyNames.push(dependencyName);
        }

        return dependencyNames;
    }

}

export {
    AboutDialog
};
