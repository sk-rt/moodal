import LayrsCore from '../core';
import LayrsController from '.';

export const anchorController = (layrsCore: LayrsCore) => {
    const anchorCtrl = new LayrsController(layrsCore);

    const getContent = (arg: string) => {
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
    };
    anchorCtrl.init(getContent, {
        controllerAttr: 'data-modal-target',
        waitContentLoaded: false,
        beforeAppend: () => {
            layrsCore.param.modalContainer.classList.add('c-content-modal');
        },
        beforeShow: content => {
            anchorCtrl.addListner(content);
        },
        afterHide: () => {
            layrsCore.param.modalContainer.classList.remove('c-content-modal');
        }
    });
    return anchorCtrl;
};
