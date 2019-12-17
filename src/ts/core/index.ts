/**!
 *
 */
import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import {
    LayrsInitialParam,
    defInitialParam,
    LayrsState,
    LayrsCreateParam,
    defCreateParam,
    HideQueue
} from '../constants/';

export default class LayrsCore {
    param: LayrsInitialParam;
    state: LayrsState;
    modalBody!: HTMLElement;
    hideQueues: HideQueue[] = [];
    constructor(param?: Partial<LayrsInitialParam>) {
        this.param = {
            ...defInitialParam,
            ...param
        };
        if (!this.param.modalContainer) {
            // eslint-disable-next-line no-console
            console.warn('No modalContainer');
            return;
        }
        this.modalBody = this.param.modalContainer.querySelector<HTMLElement>(
            `[${this.param.modalBodyAttr}]`
        );

        if (!this.modalBody) {
            // eslint-disable-next-line no-console
            console.warn('No modalBody');
            return;
        }
        if (!this.param.backgroundElement) {
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
                this.param.modalContainer.setAttribute('aria-hidden', 'true');
                this.param.modalContainer.classList.remove(
                    this.param.bodyClasses.isLoading
                );
                this.param.modalContainer.classList.remove(
                    this.param.bodyClasses.isVissible
                );
                this.state = LayrsState.HIDDEN;
                break;
            }
            case LayrsState.LOADING: {
                this.param.modalContainer.classList.remove(
                    this.param.bodyClasses.isVissible
                );
                this.param.modalContainer.classList.add(
                    this.param.bodyClasses.isLoading
                );
                this.state = LayrsState.LOADING;
                break;
            }
            case LayrsState.VISSIBLE: {
                this.param.modalContainer.setAttribute('aria-hidden', 'false');
                this.param.modalContainer.classList.remove(
                    this.param.bodyClasses.isLoading
                );
                this.param.modalContainer.classList.add(
                    this.param.bodyClasses.isVissible
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
        this.modalBody.innerHTML = '';
        this.setState(LayrsState.LOADING);
        const _content_get =
            _createParam.contentCreated(content, this) || content;
        _createParam.beforeAppend(_content_get, this);
        // Append
        this.modalBody.appendChild(_content_get);
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
            contentLoadHandler(this.modalBody)
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
        this.modalBody.innerHTML = '';
        this.setState(LayrsState.HIDDEN);
        enableScroll(this.param.backgroundElement);
        this.hideQueues.forEach(func => func.afterHideQueue());
        this.hideQueues = [];
    }
}
