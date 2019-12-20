import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import { classListAdd, classListRemove } from '../utils/classList';

import {
    MoodalInitialParam,
    defInitialParam,
    MoodalState,
    MoodalCreateParam,
    defCreateParam,
    HideQueue,
    CreateContext
} from '../constants/';
import noop from '../utils/noop';
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
            `${this.param.contentSelector}`
        );

        if (!this.contentElement) {
            // eslint-disable-next-line no-console
            console.warn(
                `No Content Element. "${this.param.contentSelector}" in Container Element`
            );
            return;
        }
        if (this.param.noBackgroundScroll && !this.param.backgroundElement) {
            console.warn(`No Background Element.
            if enable "noBackgroundScroll",you need set "backgroundElement"
            ex: backgroundElement: document.querySelector(".page-wrapper")`);
            this.param.noBackgroundScroll = false;
        }
        this.addHideEventListner();
    }

    addHideEventListner(rootEl: Document | HTMLElement = document) {
        const actionElms = rootEl.querySelectorAll(
            `${this.param.hideOnClickSelector}`
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
        createParam?: Partial<MoodalCreateParam>,
        trigger: string = ''
    ) {
        // Setup
        if (!content) {
            return;
        }
        const _createParam: MoodalCreateParam = {
            ...defCreateParam,
            waitContentLoaded: this.param.waitContentLoaded,
            noBackgroundScroll: this.param.noBackgroundScroll,
            ...createParam
        };
        this.contentElement.innerHTML = '';
        this.setState(MoodalState.LOADING);

        // Append

        const context = {
            content: (await _createParam.contentCreated(content)) || content,
            trigger: trigger
        };
        this.contentElement.appendChild(content);
        if (this.param.noBackgroundScroll) {
            disableScroll(this.param.backgroundElement);
        }
        await _createParam.afterAppend(context);
        this.enqueueHideHooks({
            beforeHideQueue: () => {
                return _createParam.beforeHide(context);
            },
            afterHideQueue: () => {
                return _createParam.afterHide(context);
            }
        });
        // Load and Show
        if (_createParam.waitContentLoaded) {
            try {
                await contentLoadHandler(this.contentElement);

                if (!_createParam.manualShow) {
                    this.show(context, _createParam);
                }
                this.addHideEventListner(context.content);
            } catch (error) {
                console.warn(error);
                this.hide();
            }
        } else {
            if (!_createParam.manualShow) {
                this.show(context, _createParam);
            }
            this.addHideEventListner(context.content);
        }
    }
    async show(context: CreateContext, createParam: MoodalCreateParam) {
        await createParam.beforeShow(context);
        this.setState(MoodalState.VISSIBLE);
        await createParam.afterShow(context);
    }
    async hide() {
        if (this.state === MoodalState.HIDDEN) {
            return;
        }
        await Promise.all(
            this.hideQueues.map(func => {
                return new Promise<void>(async resolve => {
                    const beforeHideQueue = func.beforeHideQueue;
                    func.beforeHideQueue = noop;
                    await beforeHideQueue();
                    resolve();
                });
            })
        );
        this.contentElement.innerHTML = '';
        this.setState(MoodalState.HIDDEN);
        enableScroll(this.param.backgroundElement);
        this.hideQueues.map(func => {
            const afterHideQueue = func.afterHideQueue;
            func.afterHideQueue = noop;
            return afterHideQueue();
        });
        this.hideQueues = [];
    }
}
