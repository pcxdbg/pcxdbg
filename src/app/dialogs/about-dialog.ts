import {Component} from '../../component';
import {Button} from '../../ui/button';
import {Icon, IconManager} from '../../ui/icon';
import {List, ListItemDefinition} from '../../ui/list';
import {ModalManager, ModalView} from '../../ui/modal';
import {I18nManager} from '../../lng/i18n';
import {UIElement} from '../../ui/element';
import {FileUtils} from '../../util/file-utils';
import {remote, shell} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const PATH_NODEMODULES: string = '/node_modules';
const PATH_PACKAGEJSON: string = '/package.json';

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
 * Node package
 */
interface NodePackage {
    name: string;
    description?: string;
    homepage?: string;
    license: string;
    version: string;
    dependencies?: {[dependencyName: string]: string};
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
    private revisionNumber: number;
    private buildDate: Date;

    /**
     * Class constructor
     * @param modalManager Modal manager
     * @param iconManager  Icon manager
     * @param i18nManager  i18n manager
     * @param fileUtils    File utility functions
     */
    constructor(modalManager: ModalManager, iconManager: IconManager, i18nManager: I18nManager, fileUtils: FileUtils) {
        super(modalManager);
        this.i18nManager = i18nManager;
        this.iconManager = iconManager;
        this.fileUtils = fileUtils;
        this.versionApplication = remote.app.getVersion();
        this.versionChrome = remote.process.versions.chrome;
        this.versionElectron = remote.process.versions.electron;
        this.versionNode = remote.process.versions.node;
        this.versionOpenSSL = remote.process.versions.openssl;
        this.versionV8 = remote.process.versions.v8;
        this.revisionId = process.env.REVISION_ID;
        this.revisionNumber = process.env.REVISION_NUMBER;
        this.buildDate = new Date(process.env.BUILD_TIME);

        this.buildDialog();
    }

    /**
     * Build the dialog box
     */
    private async buildDialog(): Promise<void> {
        let dialogElement: UIElement = new UIElement('about-dialog', AboutDialog.HTML);
        let versionInfoBlock: UIElement = dialogElement.element('about-content', 'version-info-list');
        let versionInfoList: VersionInformation[] = this.prepareVersionInformationList();
        let dependencyList: List<DependencyInformation> = await this.buildDependencyList();
        let closeButton: Button = new Button();

        versionInfoList.forEach(versionInfo => this.createVersionInformationElement(versionInfo).attachTo(versionInfoBlock));

        closeButton
            .label('app:dialog.control.close')
            .click(() => this.close())
        ;

        dialogElement.element('about-logo').attach(this.iconManager.createIcon(64, 64, 'title-bar-logo'));
        dialogElement.element('about-content', 'dependency-list').attach(dependencyList);
        dialogElement.element('about-content', 'about-close').attach(closeButton);

        this.attach(dialogElement);

        dialogElement.applyTranslations();
    }

    /**
     * Create a version information element
     * @param versionInfo Version information
     * @return Element
     */
    private createVersionInformationElement(versionInfo: VersionInformation): UIElement {
        let versionInfoElement: UIElement = new UIElement('version-info');
        versionInfoElement.i18n(versionInfo.value, versionInfo.parameters);
        versionInfoElement.class(versionInfo.name);
        return versionInfoElement;
    }

    /**
     * Prepare version information for display
     * @return List of version information
     */
    private prepareVersionInformationList(): VersionInformation[] {
        return [{
            name: 'app',
            value: 'app:dialog.about.version.application.label',
            parameters: {
                'version': this.versionApplication
            }
        }, {
            name: 'revision',
            value: 'app:dialog.about.version.revision.label',
            parameters: {
                'revisionId': this.revisionId,
                'revisionNumber': this.revisionNumber
            }
        }, {
            name: 'build',
            value: 'app:dialog.about.version.build.label',
            parameters: {
                'buildDate': this.i18nManager.formatDate(this.buildDate, 'LL')
            }
        }, {
            name: 'electron',
            value: 'app:dialog.about.version.electron.label',
            parameters: {
                'versionElectron': this.versionElectron,
                'versionChrome': this.versionChrome
            }
        }, {
            name: 'node',
            value: 'app:dialog.about.version.node.label',
            parameters: {
                'versionNode': this.versionNode,
                'versionV8': this.versionV8,
                'versionOpenSSL': this.versionOpenSSL
            }
        }];
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
        let nodeModulesPath: string = path.join(remote.app.getAppPath(), PATH_NODEMODULES);
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
        let packagePath: string = path.join(remote.app.getAppPath(), PATH_NODEMODULES, '/' + dependencyName, PATH_PACKAGEJSON);
        let packageContent: string = await this.fileUtils.readFileContent(packagePath);
        let packageData: NodePackage = JSON.parse(packageContent);
        let dependencyInformation: DependencyInformation = new DependencyInformation();

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
        let packagePath: string = path.join(remote.app.getAppPath(), PATH_PACKAGEJSON);
        let packageContent: string = await this.fileUtils.readFileContent(packagePath);
        let packageData: NodePackage = JSON.parse(packageContent);
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
