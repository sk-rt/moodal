import { version } from '../../../package.json';
import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import { classListAdd, classListRemove } from '../utils/classList';
import Logger, { LogLevel } from '../modules/Logger';
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
    nameSpace: string = `MoodalCore@${version}`;
    logMessagePrefix: string = `${this.nameSpace}: `;
    param: MoodalInitialParam;
    state: MoodalState;
    wrapper!: HTMLElement;
    container!: HTMLElement;
    hideQueues: HideQueue[] = [];
    logger: Logger;
    isValid: boolean = false;
    constructor(
        wrapper: HTMLElement | string,
        param?: Partial<MoodalInitialParam>
    ) {
        this.param = {
            ...defInitialParam,
            ...param
        };
        this.logger = new Logger(this.param.logLevel);

        if (wrapper && typeof wrapper === 'string') {
            this.wrapper = document.querySelector<HTMLElement>(wrapper);
        } else if (wrapper && typeof wrapper === 'object') {
            this.wrapper = wrapper;
        } else {
            this.logger.log(
                `${this.logMessagePrefix}No wrapper Element`,
                LogLevel.error
            );
            return;
        }
        if (!this.wrapper) {
            this.logger.log(
                `${this.logMessagePrefix}No wrapper Element`,
                LogLevel.error
            );
            return;
        }

        this.container = this.wrapper.querySelector<HTMLElement>(
            `${this.param.containerSelector}`
        );

        if (!this.container) {
            this.logger.log(
                `${this.logMessagePrefix}No Content Element. Put "${this.param.containerSelector}" in wrapper Element`,
                LogLevel.error
            );
            return;
        }
        if (this.param.noBackgroundScroll && !this.param.backgroundElement) {
            this.logger.log(
                `${this.logMessagePrefix}No Background Element.
                if enable "noBackgroundScroll",you need set "backgroundElement"
                ex: backgroundElement: document.querySelector(".page-wrapper`,
                LogLevel.warning
            );
            this.param.noBackgroundScroll = false;
        }
        this.isValid = true;
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
                this.wrapper.setAttribute('aria-hidden', 'true');
                classListRemove(
                    this.wrapper,
                    this.param.stateClasses.isLoading
                );
                classListRemove(
                    this.wrapper,
                    this.param.stateClasses.isVissible
                );

                this.state = MoodalState.HIDDEN;
                break;
            }
            case MoodalState.LOADING: {
                classListRemove(
                    this.wrapper,
                    this.param.stateClasses.isVissible
                );
                classListAdd(this.wrapper, this.param.stateClasses.isLoading);

                this.state = MoodalState.LOADING;
                break;
            }
            case MoodalState.VISSIBLE: {
                this.wrapper.setAttribute('aria-hidden', 'false');
                classListRemove(
                    this.wrapper,
                    this.param.stateClasses.isLoading
                );
                classListAdd(this.wrapper, this.param.stateClasses.isVissible);

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
            this.hide();
            return;
        }
        const _createParam: MoodalCreateParam = {
            ...defCreateParam,
            waitContentLoaded: this.param.waitContentLoaded,
            noBackgroundScroll: this.param.noBackgroundScroll,
            ...createParam
        };
        this.container.innerHTML = '';
        this.setState(MoodalState.LOADING);

        // Append

        const context = {
            content: (await _createParam.contentCreated(content)) || content,
            trigger: trigger
        };
        this.container.appendChild(content);
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
                await contentLoadHandler(this.container);

                if (!_createParam.manualShow) {
                    this.show(context, _createParam);
                }
                this.addHideEventListner(context.content);
            } catch (error) {
                // eslint-disable-next-line no-console
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
                return new Promise<void>(resolve => {
                    const beforeHideQueue = func.beforeHideQueue;
                    func.beforeHideQueue = noop;
                    (async () => {
                        await beforeHideQueue();
                        resolve();
                    })();
                });
            })
        );
        this.container.innerHTML = '';
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
