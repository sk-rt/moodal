import LayrsCore from '../core';
import noop from '../utils/noop';
/**
 * Layrs State
 */
export enum LayrsState {
    HIDDEN = 'HIDDEN',
    LOADING = 'LOADING',
    VISSIBLE = 'VISSIBLE'
}
/**
 * Initial Params
 */
export interface LayrsInitialParam {
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
export const nameSpace = `layrs`;
export const defInitialParam: LayrsInitialParam = {
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
type callback = (content: HTMLElement, modalCore: LayrsCore) => void;
type hook = (content: HTMLElement, modalCore: LayrsCore) => HTMLElement | void;
export interface LayrsCallbacks {
    beforeAppend: callback;
    afterAppend: callback;
    beforeShow: callback;
    afterShow: callback;
    beforeHide: callback;
    afterHide: callback;
    contentCreated: hook;
    contentLoaded: hook;
}
export interface LayrsCreateParam extends LayrsCallbacks {
    waitContentLoaded: boolean | null;
    noBackgroundScroll: boolean | null;
    manualShow: boolean;
}
export const defCreateParam: LayrsCreateParam = {
    waitContentLoaded: undefined,
    noBackgroundScroll: undefined,
    manualShow: false,
    beforeAppend: noop,
    afterAppend: noop,
    beforeShow: noop,
    afterShow: noop,
    beforeHide: noop,
    afterHide: noop,
    contentCreated: content => content,
    contentLoaded: content => content
};
/**
 * Callback Queues On Hidden
 */
export interface HideQueue {
    beforeHideQueue: () => void;
    afterHideQueue: () => void;
}
