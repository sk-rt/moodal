import {
  version,
  MoodalInitialParam,
  defInitialParam,
  MoodalState,
  MoodalCreateParam,
  defCreateParam,
  HideQueue,
  CreateContext,
} from '../constants/';
import Logger, { LogLevel } from '../modules/Logger';
import { disableScroll, enableScroll } from '../utils/disableScroll';
import { contentLoadHandler } from '../utils/contentLoadHandler';
import { classListAdd, classListRemove } from '../utils/classList';
import noop from '../utils/noop';

/**
 * Moodal Core
 */
export default class MoodalCore {
  logMessagePrefix: string = `[MoodalCore@${version}] `;
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
      ...param,
    };
    this.logger = new Logger(this.param.logLevel);

    if (wrapper && typeof wrapper === 'string') {
      this.wrapper = document.querySelector<HTMLElement>(wrapper);
    } else if (wrapper && typeof wrapper === 'object') {
      this.wrapper = wrapper;
    }
    if (!this.wrapper) {
      this.logger.log(
        LogLevel.error,
        `${this.logMessagePrefix}No Wrapper Element`
      );
      return;
    }

    this.container = this.wrapper.querySelector<HTMLElement>(
      `${this.param.containerSelector}`
    );

    if (!this.container) {
      this.logger.log(
        LogLevel.error,
        `${this.logMessagePrefix}No Container Element. Put "${this.param.containerSelector}" in Wrapper Element`
      );
      return;
    }
    if (this.param.noBackgroundScroll && !this.param.backgroundElement) {
      this.logger.log(
        LogLevel.warning,
        `${this.logMessagePrefix}No Background Element.
                if enable "noBackgroundScroll", you need set "backgroundElement"
                ex: backgroundElement: document.querySelector(".page-wrapper")`
      );
      this.param.noBackgroundScroll = false;
    }
    this.isValid = true;
    this.addHideEventListner();
  }

  addHideEventListner(rootEl: Document | HTMLElement = document) {
    const actionEls = rootEl.querySelectorAll(
      `${this.param.hideOnClickSelector}`
    );
    if (!actionEls) {
      return;
    }
    [].slice.call(actionEls).forEach((element: HTMLElement) => {
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
        classListRemove(this.wrapper, this.param.stateClasses.isLoading);
        classListRemove(this.wrapper, this.param.stateClasses.isVissible);

        this.state = MoodalState.HIDDEN;
        break;
      }
      case MoodalState.LOADING: {
        classListRemove(this.wrapper, this.param.stateClasses.isVissible);
        classListAdd(this.wrapper, this.param.stateClasses.isLoading);

        this.state = MoodalState.LOADING;
        break;
      }
      case MoodalState.VISSIBLE: {
        this.wrapper.setAttribute('aria-hidden', 'false');
        classListRemove(this.wrapper, this.param.stateClasses.isLoading);
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
    context: CreateContext,
    createParam?: Partial<MoodalCreateParam>
  ) {
    // Validate Param
    if (!context.content) {
      this.logger.log(
        LogLevel.warning,
        `${this.logMessagePrefix}No content. "content" param is required`
      );
      this.hide();
      return;
    }
    this.setState(MoodalState.LOADING);

    // SetUp Context
    const _createParam: MoodalCreateParam = {
      ...defCreateParam,
      waitContentLoaded: this.param.waitContentLoaded,
      noBackgroundScroll: this.param.noBackgroundScroll,
      ...createParam,
    };
    const _context: CreateContext = {
      content:
        (await _createParam.contentCreated(context.content)) || context.content,
      trigger: context.trigger,
    };
    this.container.innerHTML = '';

    // Append Content
    await _createParam.beforeAppend(_context);
    this.container.appendChild(_context.content);
    if (this.param.noBackgroundScroll) {
      disableScroll(this.param.backgroundElement);
    }
    await _createParam.afterAppend(_context);
    this.enqueueHideHooks({
      beforeHideQueue: () => {
        return _createParam.beforeHide(_context);
      },
      afterHideQueue: () => {
        return _createParam.afterHide(_context);
      },
    });
    // Load and Show
    if (_createParam.waitContentLoaded) {
      try {
        await contentLoadHandler(this.container);

        if (!_createParam.manualShow) {
          this.show(_context, _createParam);
        }
        this.addHideEventListner(_context.content);
      } catch (error) {
        this.logger.log(LogLevel.warning, error);
        this.hide();
      }
    } else {
      if (!_createParam.manualShow) {
        this.show(_context, _createParam);
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
      this.hideQueues.map((func) => {
        return new Promise<void>((resolve) => {
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
    this.hideQueues.map((func) => {
      const afterHideQueue = func.afterHideQueue;
      func.afterHideQueue = noop;
      return afterHideQueue();
    });
    this.hideQueues = [];
  }
}
