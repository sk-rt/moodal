import MoodalCore from '../core';
import { MoodalState, MoodalCreateParam } from '../constants';
import simpleAddListener, { RemoveListener } from '../utils/simpleAddListener';
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
    constructor(coreInstance: MoodalCore, param: MoodalControllerParam) {
        this.core = coreInstance;
        this.init(param);
    }
    init(param?: MoodalControllerParam) {
        if (!param.getContent || typeof param.getContent !== 'function') {
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

    async show(trigger: string) {
        this.core.setState(MoodalState.LOADING);
        try {
            if (!this.param || !this.param.getContent) {
                throw new Error('Please setup param before `show()`');
            }
            if (!trigger) {
                throw new Error('No trigger string');
            }
            const content = await this.param.getContent(trigger);
            this.core.create(content, this.param, trigger);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            this.core.hide();
        }
    }
    destroy() {
        if (this.removeListners.length !== 0) {
            this.removeListners.map(remove => remove());
        }
    }
}
