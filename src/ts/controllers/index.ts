import LayrsCore from '../core';
import { LayrsState, LayrsCreateParam } from '../constants';
/**
 * Controler
 */
export interface LayrsControllerParam extends Partial<LayrsCreateParam> {
    controllerAttr: string;
}
export default class LayrsController {
    param: LayrsControllerParam;
    modalCore: LayrsCore;
    getContent: (arg: string) => Promise<HTMLElement>;
    constructor(modalCoreInstance: LayrsCore) {
        this.modalCore = modalCoreInstance;
    }
    init(
        getContent: LayrsController['getContent'],
        param?: Partial<LayrsControllerParam>
    ) {
        this.getContent = getContent;
        this.param = {
            controllerAttr: 'data-modal-controll',
            ...param
        };
        this.addListner();
    }
    addListner(rootEl: Document | HTMLElement = document) {
        const modalBtn = rootEl.querySelectorAll(
            `[${this.param.controllerAttr}]`
        );
        if (!modalBtn) {
            return;
        }
        [].slice.call(modalBtn).forEach((element: HTMLElement) => {
            element.addEventListener('click', event => {
                event.preventDefault();
                const target = element.getAttribute(this.param.controllerAttr);
                this.show(target);
            });
        });
    }

    async show(target: string) {
        if (this.param && !this.getContent) {
            // eslint-disable-next-line no-console
            console.warn('Error: Please `.init()` before show()');
            return;
        }
        if (!target) {
            return;
        }
        this.modalCore.setState(LayrsState.LOADING);
        try {
            const content = await this.getContent(target);
            this.modalCore.create(content, this.param);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            this.modalCore.hide();
        }
    }
}
