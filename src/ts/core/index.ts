import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import { classListAdd, classListRemove } from '../utils/classList';

import {
    MoodalInitialParam,
    defInitialParam,
    MoodalState,
    MoodalCreateParam,
    defCreateParam,
    HideQueue
} from '../constants/';
/**
 * Moodal Core
 */
export default class MoodalCore {
    param: MoodalInitialParam;
    state: MoodalState;
    container!: HTMLElement;
    contentElement!: HTMLElement;
    hideQueues: HideQueue[] = [];
    constructor(container: HTMLElement, param?: Partial<MoodalInitialParam>) {
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
                if (this.state !== MoodalState.HIDDEN) {
                    this.hide();
                }
            });
        });
    }
    setState(action: MoodalState) {
        switch (action) {
            case MoodalState.HIDDEN: {
                this.container.setAttribute('aria-hidden', 'true');
                classListRemove(
                    this.container,
                    this.param.stateClasses.isLoading
                );
                classListRemove(
                    this.container,
                    this.param.stateClasses.isVissible
                );

                this.state = MoodalState.HIDDEN;
                break;
            }
            case MoodalState.LOADING: {
                classListRemove(
                    this.container,
                    this.param.stateClasses.isVissible
                );
                classListAdd(this.container, this.param.stateClasses.isLoading);

                this.state = MoodalState.LOADING;
                break;
            }
            case MoodalState.VISSIBLE: {
                this.container.setAttribute('aria-hidden', 'false');
                classListRemove(
                    this.container,
                    this.param.stateClasses.isLoading
                );
                classListAdd(
                    this.container,
                    this.param.stateClasses.isVissible
                );

                this.state = MoodalState.VISSIBLE;
                break;
            }

            default:
                break;
        }
    }
    enqueueHideHooks(hideQueue: HideQueue) {
        this.hideQueues.push(hideQueue);
    }

    async create(
        content: HTMLElement,
        createParam?: Partial<MoodalCreateParam>
    ) {
        // Setup
        const _createParam: MoodalCreateParam = {
            ...defCreateParam,
            waitContentLoaded: this.param.waitContentLoaded,
            noBackgroundScroll: this.param.noBackgroundScroll,
            ...createParam
        };
        this.contentElement.innerHTML = '';
        this.setState(MoodalState.LOADING);
        let _content = content;

        // Append
        _content = (await _createParam.beforeAppend(_content)) || _content;
        this.contentElement.appendChild(_content);
        if (this.param.noBackgroundScroll) {
            disableScroll(this.param.backgroundElement);
        }
        _content = (await _createParam.afterAppend(_content)) || _content;
        this.enqueueHideHooks({
            beforeHideQueue: () => {
                return _createParam.beforeHide(_content);
            },
            afterHideQueue: () => {
                return _createParam.afterHide(_content);
            }
        });
        // Load and Show
        if (_createParam.waitContentLoaded) {
            try {
                await contentLoadHandler(this.contentElement);

                if (!_createParam.manualShow) {
                    this.show(_content, _createParam);
                }
                this.addHideEventListner(_content);
            } catch (error) {
                console.warn(error);
                this.hide();
            }
        } else {
            if (!_createParam.manualShow) {
                this.show(_content, _createParam);
            }
            this.addHideEventListner(_content);
        }
    }
    async show(content: HTMLElement, createParam: MoodalCreateParam) {
        await createParam.beforeShow(content);
        this.setState(MoodalState.VISSIBLE);
        await createParam.afterShow(content);
    }
    async hide() {
        await Promise.all(
            this.hideQueues.map(func => {
                return new Promise<void>(async resolve => {
                    await func.beforeHideQueue();
                    resolve();
                });
            })
        );
        this.contentElement.innerHTML = '';
        this.setState(MoodalState.HIDDEN);
        enableScroll(this.param.backgroundElement);
        await Promise.all(
            this.hideQueues.map(func => {
                return new Promise<void>(async resolve => {
                    await func.afterHideQueue();
                    resolve();
                });
            })
        );
        this.hideQueues = [];
    }
}
