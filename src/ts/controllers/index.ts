import MoodalCore from '../core';
import { version, MoodalState, MoodalCreateParam } from '../constants';
import simpleAddListener, { RemoveListener } from '../utils/simpleAddListener';
import { LogLevel } from '../modules/Logger';

/**
 * Controler
 */
type GetContent = (trigger: string) => Promise<HTMLElement> | HTMLElement;
export interface MoodalControllerParam extends Partial<MoodalCreateParam> {
    controllerAttr?: string;
    getContent: GetContent;
}
export default class MoodalController {
    param: MoodalControllerParam;
    core: MoodalCore;
    removeListners: RemoveListener[];
    logMessagePrefix: string = `[MoodalController@${version}] `;
    constructor(coreInstance: MoodalCore, param: MoodalControllerParam) {
        this.core = coreInstance;
        this.init(param);
    }
    init(param?: MoodalControllerParam) {
        if (!this.core.isValid) {
            return;
        }
        if (!param.getContent || typeof param.getContent !== 'function') {
            this.core.logger.log(
                LogLevel.warning,
                `${this.logMessagePrefix}No "GetContent()" Parameter`
            );
            return;
        }
        this.param = {
            controllerAttr: ``,
            ...param
        };
        this.removeListners = this.addControllListner() || [];
    }
    addControllListner(rootEl: Document | HTMLElement = document) {
        if (!this.param.controllerAttr) {
            return;
        }
        const ctrlElement: HTMLElement[] = [].slice.call(
            rootEl.querySelectorAll(`[${this.param.controllerAttr}]`)
        );
        if (ctrlElement.length === 0) {
            this.core.logger.log(
                LogLevel.warning,
                `${this.logMessagePrefix}Can't find "this.param.controllerAttr" Element`
            );
            return;
        }
        return ctrlElement.map((element: HTMLElement) => {
            return simpleAddListener(element, 'click', event => {
                event.preventDefault();
                const target = element.getAttribute(this.param.controllerAttr);
                this.show(target);
            });
        });
    }
    hide() {
        this.core.hide();
    }

    async show(trigger: string = '') {
        try {
            this.core.setState(MoodalState.LOADING);
            if (!this.param || !this.param.getContent) {
                throw 'Please initialize before "show()"';
            }
            const content = await this.param.getContent(trigger);
            if (!content) {
                throw 'No content. "getContent()" must return DOM Element';
            }
            this.core.create(
                { content: content, trigger: trigger },
                this.param
            );
        } catch (error) {
            if (!this.core) {
                return;
            }
            this.core.logger.log(
                LogLevel.warning,
                `${this.logMessagePrefix}`,
                error
            );
            this.core.hide();
        }
    }

    destroy() {
        if (this.removeListners.length !== 0) {
            this.removeListners.map(remove => remove());
            this.removeListners = null;
        }
        this.param = null;
    }
}
