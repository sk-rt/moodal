import LayrsCore from '../core';
import LayrsController from '.';

export const anchorController = (layrsCore: LayrsCore) => {
    const anchorCtrl = new LayrsController(layrsCore);

    anchorCtrl.init({
        controllerAttr: 'data-modal-target',

        getContent: arg => {
            return new Promise<HTMLElement>((resolve, rejects) => {
                const content = document.querySelector<HTMLElement>(`#${arg}`);
                if (content) {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = content.innerHTML;
                    resolve(wrapper);
                } else {
                    rejects();
                }
            });
        }
    });
    return anchorCtrl;
};
