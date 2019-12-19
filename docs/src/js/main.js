import '../scss/style.scss';
import '../../../dist/css/moodal-core.css';

import Moodal from '../../../dist/esm/index.mjs';
import * as all from '../../../dist/esm/index.mjs';

document.addEventListener(
    'DOMContentLoaded',
    () => {
        modalInit();
        console.log(all);
    },
    false
);

const modalInit = () => {
    const modal = new Moodal(document.querySelector('.c-moodal'), {
        noBackgroundScroll: false,
        backgroundElement: document.querySelector('.l-wrapper')
    });
    console.log(modal);

    const modalCtrl = modal.addController({
        controllerAttr: 'data-modal-target',
        noBackgroundScroll: true,
        backgroundElement: document.querySelector('.l-wrapper'),

        getContent: arg => {
            const wrapper = document.getElementById(arg);
            if (!wrapper) {
                return;
            }
            const content = document.createElement('div');
            content.innerHTML = wrapper.innerHTML;
            return content;
        }
    });
    // modalCtrl.show('content01');

    const modalAcyncCtrl = modal.addController({
        controllerAttr: 'data-modal-acync',
        waitContentLoaded: true,
        getContent: arg => {
            return new Promise((resolve, rejects) => {
                const wrapper = document.getElementById(arg);
                if (!wrapper) {
                    rejects(new Error('No Target!'));
                }
                const content = document.createElement('div');
                content.innerHTML = wrapper.innerHTML;
                resolve(content);
            });
        },
        beforeAppend: () => {
            document.body.classList.add('c-content-modal');
        },
        beforeShow: content => {
            modalAcyncCtrl.addControllListner(content);
        },
        afterHide: () => {
            document.body.classList.remove('c-content-modal');
        }
    });
};
