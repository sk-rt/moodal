import MoodalCore from '../core';
import { MoodalState, MoodalCreateParam } from '../constants';
import simpleAddListener from '../utils/simpleAddListener';
/**
 * Controler
 */
type GetContent = (arg: string) => Promise<HTMLElement> | HTMLElement;
export interface MoodalControllerParam extends Partial<MoodalCreateParam> {
    controllerAttr?: string;
    getContent?: GetContent;
}
export default class MoodalController {
    param: MoodalControllerParam;
    core: MoodalCore;
    constructor(
        coreInstance: MoodalCore,
        param?: Partial<MoodalControllerParam>
    ) {
        this.core = coreInstance;
        this.init(param);
    }
    init(param?: Partial<MoodalControllerParam>) {
        this.param = {
            controllerAttr: ``,
            ...param
        };
        this.addControllListner();
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

    async show(target: string) {
        this.core.setState(MoodalState.LOADING);
        try {
            if (!this.param || !this.param.getContent) {
                throw new Error('Please run `init()` before `show()`');
            }
            if (!target) {
                return;
            }
            const content = await this.param.getContent(target);
            this.core.create(content, this.param);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            this.core.hide();
        }
    }
}
