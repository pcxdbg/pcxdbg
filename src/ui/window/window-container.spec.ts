import {Icon, IconManager} from '../control';
import {WindowContainer} from './window-container';
import {WindowContainerAnchor} from './window-container-anchor';
import {WindowContainerMode} from './window-container-mode';
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
        (<ModeStringPair[]> [
            {mode: WindowContainerMode.AUTO_HIDE, modeString: 'auto-hide'},
            {mode: WindowContainerMode.DOCKED, modeString: 'docked'},
            {mode: WindowContainerMode.DOCKED_DOCUMENT, modeString: 'docked-document'}
        ]).forEach(modePair => describe(modePair.modeString, () => {

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

            it('throws an exception when an unknown attribute value is present', () => {
                // given
                windowContainer.getNativeElement().setAttribute('mode', 'test-invalid-mode');
                // then
                expect(() => windowContainer.getMode()).toThrowError(/unknown window container mode attribute/);
            });

        }));
    });

    describe('anchor', () => {
        class AnchorStringPair {
            anchor: WindowContainerAnchor;
            anchorString: string;
        }
        (<AnchorStringPair[]> [
            {anchor: WindowContainerAnchor.BOTTOM, anchorString: 'bottom'},
            {anchor: WindowContainerAnchor.LEFT, anchorString: 'left'},
            {anchor: WindowContainerAnchor.NONE, anchorString: 'none'},
            {anchor: WindowContainerAnchor.RIGHT, anchorString: 'right'}
        ]).forEach(anchorPair => describe(anchorPair.anchorString, () => {

            it('can be set', () => {
                // when
                windowContainer.setAnchor(anchorPair.anchor);
                // then
                let anchorString: string = windowContainer.getNativeElement().getAttribute('anchor');
                expect(anchorString).toEqual(anchorPair.anchorString);
            });

            it('can be retrieved', () => {
                // given
                windowContainer.getNativeElement().setAttribute('anchor', anchorPair.anchorString);
                // when
                let anchor: WindowContainerAnchor = windowContainer.getAnchor();
                // then
                expect(anchor).toEqual(anchorPair.anchor);
            });

            it('throws an exception when an unknwon attribute value is present', () => {
                // given
                windowContainer.getNativeElement().setAttribute('anchor', 'test-invalid-anchor');
                // then
                expect(() => windowContainer.getAnchor()).toThrowError(/unknown window container anchor attribute/);
            });

        }));
    });

});
