import {WindowContainer} from './window-container';
import {WindowContainerMode} from './window-container-mode';
import {Icon, IconManager} from '../element';
import {createMockInstance} from 'jest-create-mock-instance';

describe('Window container', () => {
    let windowContainer: WindowContainer;
    let iconManager: jest.Mocked<IconManager>;

    beforeEach(() => {
        iconManager = createMockInstance(IconManager);
        iconManager.createIcon.mockReturnValue(createMockInstance(Icon));
        windowContainer = new WindowContainer(iconManager);
    });

    describe('mode', () => {
        class ModeStringPair {
            mode: WindowContainerMode;
            modeString: string;
        }
        [
            {mode: WindowContainerMode.AUTO_HIDE, modeString: 'auto-hide'},
            {mode: WindowContainerMode.DOCKED, modeString: 'docked'},
            {mode: WindowContainerMode.DOCKED_DOCUMENT, modeString: 'docked-document'}
        ].forEach(modePair => {
            describe(modePair.modeString, () => {

                it('can be set', () => {
                    // when
                    windowContainer.setMode(modePair.mode);
                    // then
                    let modeString: string = windowContainer.getNativeElement().getAttribute('mode');
                    expect(modeString).toEqual(modePair.modeString);
                });

                it('can be retrieved', () => {
                    // given
                    windowContainer.getNativeElement().setAttribute('mode', modePair.modeString);
                    // when
                    let mode: WindowContainerMode = windowContainer.getMode();
                    // then
                    expect(mode).toEqual(modePair.mode);
                });

            });
        });
    });

});
