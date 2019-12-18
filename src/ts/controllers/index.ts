import LayrsCore from '../core';
import { LayrsState, LayrsCreateParam, nameSpace } from '../constants';
/**
 * Controler
 */
type GetContent = (arg: string) => Promise<HTMLElement> | HTMLElement;
export interface LayrsControllerParam extends Partial<LayrsCreateParam> {
    controllerAttr: string;
    getContent?: GetContent;
}
export default class LayrsController {
    param: LayrsControllerParam;
    core: LayrsCore;
    constructor(
        coreInstance: LayrsCore,
        param?: Partial<LayrsControllerParam>
    ) {
        this.core = coreInstance;
        this.init(param);
    }
    init(param?: Partial<LayrsControllerParam>) {
        this.param = {
            controllerAttr: `data-${nameSpace}-controll`,
            ...param
        };
        this.addControllListner();
    }
    addControllListner(rootEl: Document | HTMLElement = document) {
        const ctrlElement: HTMLElement[] = [].slice.call(
            rootEl.querySelectorAll(`[${this.param.controllerAttr}]`)
        );
        if (ctrlElement.length === 0) {
            return;
        }
        ctrlElement.forEach((element: HTMLElement) => {
            element.addEventListener('click', event => {
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
        this.core.setState(LayrsState.LOADING);
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
