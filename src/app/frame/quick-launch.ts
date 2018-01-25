import {Component, Inject} from 'injection';
import {CommandManager, UIElement} from 'ui';

/**
 * Quick launch
 */
@Component
class QuickLaunch extends UIElement {
    private static HTML: string = `
        <form i18n="[title]app:quick-launch.title">
            <input type="text" name="quicklaunch" i18n="[placeholder]app:quick-launch.placeholder" autocomplete="off" autocorrect="off" autocapitalize="off"/>
            <input type="submit" value="" i18n="[title]app:quick-launch.search"/>
            <menu popup class="right">
                <menu-item>
                    <label>No search results available.</label>
                </menu-item>
            </menu>
        </form>
    `;

    private inputField: HTMLInputElement;

    /**
     * Class constructor
     */
    constructor() {
        super('quick-launch', QuickLaunch.HTML);
        let form: HTMLFormElement = this.selectNativeElement<HTMLFormElement>('form');

        form.addEventListener('submit', e => e.preventDefault() && this.launch());

        this.inputField = this.selectNativeElement<HTMLInputElement>('form', 'input[type=text]'); // TODO: proper Input class
        this.inputField.addEventListener('cut', (e) => {
            console.log('cut event', e);
        }, false);
        this.inputField.addEventListener('blur', () => this.onFocusLost(), false);
        this.inputField.addEventListener('focus', () => this.onFocus(), false);
        this.inputField.addEventListener('keyup', () => this.onInputChange(), false);

        
    }

    /**
     * Set the command manager
     * @param commandManager Command manager
     */
    @Inject
    setCommandManager(commandManager: CommandManager): void {
        commandManager.on('quicklaunch.focus', () => this.inputField.focus());
    }

    /**
     * Launch the selected item
     */
    private launch(): void {
        console.log('Quick launch not implemented');
    }

    /**
     * Event triggered when the input field's value changes
     */
    private onInputChange(): void {
        console.log('Quick launch value is now ' + this.inputField.value);
    }

    /**
     * Event triggered when focus is gained
     */
    private onFocus(): void {
        this.attribute('has-focus', '');
    }

    /**
     * Event triggered when focus is lost
     */
    private onFocusLost(): void {
        this.removeAttribute('has-focus');
    }

}

export {
    QuickLaunch
};
