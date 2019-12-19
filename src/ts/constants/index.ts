import MoodalCore from '../core';
import noop from '../utils/noop';
/**
 * State
 */
export enum MoodalState {
    HIDDEN = 'HIDDEN',
    LOADING = 'LOADING',
    VISSIBLE = 'VISSIBLE'
}
/**
 * Initial Params
 */
export interface MoodalInitialParam {
    contentAttr: string;
    modalHideAttr: string;
    noBackgroundScroll: boolean;
    backgroundElement?: HTMLElement;
    waitContentLoaded: boolean;
    stateClasses: {
        isVissible: string | string[];
        isLoading: string | string[];
    };
}
export const nameSpace = `moodal`;
export const defInitialParam: MoodalInitialParam = {
    contentAttr: `data-${nameSpace}-content`,
    modalHideAttr: `data-${nameSpace}-close`,
    noBackgroundScroll: false,
    backgroundElement: undefined,
    waitContentLoaded: true,
    stateClasses: {
        isVissible: 'is-vissible',
        isLoading: 'is-loading'
    }
};

/**
 * Create Params
 */
// type callback = (content: HTMLElement, modalCore: MoodalCore) => void;
export type CreateContext = {
    content: HTMLElement;
    trigger: string;
};
type Contentfilter = (
    content: HTMLElement
) => HTMLElement | Promise<HTMLElement> | void;
type Hook = (context: CreateContext) => Promise<void> | void;

export interface MoodalCallbacks {
    contentCreated: Contentfilter;
    beforeAppend: Hook;
    afterAppend: Hook;
    beforeShow: Hook;
    afterShow: Hook;
    beforeHide: Hook;
    afterHide: Hook;
}
export interface MoodalCreateParam extends MoodalCallbacks {
    waitContentLoaded: boolean | null;
    noBackgroundScroll: boolean | null;
    manualShow: boolean;
}
export const defCreateParam: MoodalCreateParam = {
    waitContentLoaded: undefined,
    noBackgroundScroll: undefined,
    manualShow: false,
    contentCreated: noop,
    beforeAppend: noop,
    afterAppend: noop,
    beforeShow: noop,
    afterShow: noop,
    beforeHide: noop,
    afterHide: noop
};
/**
 * Callback Queues On Hidden
 */
export interface HideQueue {
    beforeHideQueue: () => Promise<void> | void;
    afterHideQueue: () => Promise<void> | void;
}
