import '../scss/style.scss';
import '../../../lib/css/moodal-core.css';
import axios from 'axios';

import Moodal from '../../../';

document.addEventListener(
    'DOMContentLoaded',
    () => {
        modalInit();
    },
    false
);

const modalInit = () => {
    const modal = new Moodal(document.querySelector('.c-moodal'), {
        noBackgroundScroll: true,
        backgroundElement: document.querySelector('.l-wrapper')
    });
    console.log(modal);

    const modalCtrl = modal.addController({
        controllerAttr: 'data-modal-target',
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
        getContent: trigger => {
            return new Promise(async (resolve, rejects) => {
                try {
                    const res = await axios.get(trigger, {
                        responseType: 'document'
                    });
                    const content = res.data.querySelector('#content');
                    if (content) {
                        resolve(content);
                    } else {
                        rejects(new Error('NO Element'));
                    }
                } catch (error) {
                    console.log(error);
                    rejects(error);
                }
            });
        },
        beforeAppend: context => {
            return new Promise((resolve, rejects) => {
                setTimeout(() => {
                    console.log('before:append', context);
                    resolve(context);
                }, 100);
            });
        },

        beforeShow: ({ content }) => {
            console.log('before:show');
            content.querySelector('img').classList.add('test');
        },
        beforeHide: () => {
            console.log('before:Hide');
        }
    });
};
