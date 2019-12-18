import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import { classListAdd, classListRemove } from '../utils/classList';

import {
    LayrsInitialParam,
    defInitialParam,
    LayrsState,
    LayrsCreateParam,
    defCreateParam,
    HideQueue
} from '../constants/';
/**
 * Layrs Core
 */
export default class LayrsCore {
    param: LayrsInitialParam;
    state: LayrsState;
    container!: HTMLElement;
    contentElement!: HTMLElement;
    hideQueues: HideQueue[] = [];
    constructor(container: HTMLElement, param?: Partial<LayrsInitialParam>) {
        this.param = {
            ...defInitialParam,
            ...param
        };
        if (!container) {
            // eslint-disable-next-line no-console
            console.warn('No Container Element');
            return;
        }
        this.container = container;
        this.contentElement = this.container.querySelector<HTMLElement>(
            `[${this.param.contentAttr}]`
        );

        if (!this.contentElement) {
            // eslint-disable-next-line no-console
            console.warn(
                `No Content Element. Need a element has "${this.param.contentAttr}" attribute in Container Element`
            );
            return;
        }
        if (this.param.noBackgroundScroll && !this.param.backgroundElement) {
            console.warn(`No Background Element.
            if enable "noBackgroundScroll",you need set "backgroundElement" option
            ex: backgroundElement: document.querySelector(".page-wrapper")`);
            this.param.noBackgroundScroll = false;
        }
        this.addHideEventListner();
    }

    addHideEventListner(rootEl: Document | HTMLElement = document) {
        const actionElms = rootEl.querySelectorAll(
            `[${this.param.modalHideAttr}]`
        );
        if (!actionElms) {
            return;
        }
        [].slice.call(actionElms).forEach((element: HTMLElement) => {
            element.addEventListener('click', () => {
                if (this.state !== LayrsState.HIDDEN) {
                    this.hide();
                }
            });
        });
    }
    setState(action: LayrsState) {
        switch (action) {
            case LayrsState.HIDDEN: {
                this.container.setAttribute('aria-hidden', 'true');
                classListRemove(
                    this.container,
                    this.param.stateClasses.isLoading
                );
                classListRemove(
                    this.container,
                    this.param.stateClasses.isVissible
                );

                this.state = LayrsState.HIDDEN;
                break;
            }
            case LayrsState.LOADING: {
                classListRemove(
                    this.container,
                    this.param.stateClasses.isVissible
                );
                classListAdd(this.container, this.param.stateClasses.isLoading);

                this.state = LayrsState.LOADING;
                break;
            }
            case LayrsState.VISSIBLE: {
                this.container.setAttribute('aria-hidden', 'false');
                classListRemove(
                    this.container,
                    this.param.stateClasses.isLoading
                );
                classListAdd(
                    this.container,
                    this.param.stateClasses.isVissible
                );

                this.state = LayrsState.VISSIBLE;
                break;
            }

            default:
                break;
        }
    }
    enqueueHideHooks(hideQueue: HideQueue) {
        this.hideQueues.push(hideQueue);
    }

    create(content: HTMLElement, createParam?: Partial<LayrsCreateParam>) {
        if (!content) {
            return;
        }
        const _createParam: LayrsCreateParam = {
            ...defCreateParam,
            waitContentLoaded: this.param.waitContentLoaded,
            noBackgroundScroll: this.param.noBackgroundScroll,
            ...createParam
        };
        this.contentElement.innerHTML = '';
        this.setState(LayrsState.LOADING);
        const _content_get =
            _createParam.contentCreated(content, this) || content;
        _createParam.beforeAppend(_content_get, this);
        // Append
        this.contentElement.appendChild(_content_get);
        if (this.param.noBackgroundScroll) {
            disableScroll(this.param.backgroundElement);
        }
        _createParam.afterAppend(_content_get, this);
        this.enqueueHideHooks({
            beforeHideQueue: () => {
                _createParam.beforeHide(_content_get, this);
            },
            afterHideQueue: () => {
                _createParam.afterHide(_content_get, this);
            }
        });
        // Load and Show

        if (_createParam.waitContentLoaded) {
            contentLoadHandler(this.contentElement)
                .then(() => {
                    const _content_ready =
                        _createParam.contentLoaded(_content_get, this) ||
                        _content_get;
                    if (!_createParam.manualShow) {
                        this.show(_content_ready, _createParam);
                    }
                    this.addHideEventListner(_content_ready);
                })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.warn(e);
                    this.hide();
                });
        } else {
            const _content_ready =
                _createParam.contentLoaded(_content_get, this) || _content_get;
            if (!_createParam.manualShow) {
                this.show(_content_ready, _createParam);
            }
            this.addHideEventListner(_content_ready);
        }
    }
    show(content: HTMLElement, createParam: LayrsCreateParam) {
        createParam.beforeShow(content, this);
        this.setState(LayrsState.VISSIBLE);
        createParam.afterShow(content, this);
    }
    hide() {
        this.hideQueues.forEach(func => func.beforeHideQueue());
        this.contentElement.innerHTML = '';
        this.setState(LayrsState.HIDDEN);
        enableScroll(this.param.backgroundElement);
        this.hideQueues.forEach(func => func.afterHideQueue());
        this.hideQueues = [];
    }
}
