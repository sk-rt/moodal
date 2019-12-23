import '../scss/style.scss';
import 'moodal/lib/css/moodal-core.css';
import axios from 'axios';

import Moodal from 'moodal';

document.addEventListener(
    'DOMContentLoaded',
    () => {
        modalInit();
    },
    false
);

const modalInit = () => {
    const modal = new Moodal('.c-moodal', {
        noBackgroundScroll: true,
        logLevel: 3
    });
    if (!modal.isValid) {
        return;
    }

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

    modalCtrl.show('aaa');

    modal.addController({
        controllerAttr: 'data-modal-acync',
        waitContentLoaded: true,
        getContent: trigger => {
            return new Promise((resolve, rejects) => {
                (async () => {
                    try {
                        const res = await axios.get(trigger, {
                            responseType: 'document'
                        });
                        const content = res.data.querySelector('#content');
                        if (content) {
                            resolve(content);
                        } else {
                            throw new Error('No Content!');
                        }
                    } catch (error) {
                        rejects(error);
                    }
                })();
            });
        },
        beforeAppend: context => {
            return new Promise(resolve => {
                setTimeout(() => {
                    // eslint-disable-next-line no-console
                    console.log('before:append', context);
                    resolve(context);
                }, 100);
            });
        },

        beforeShow: ({ content }) => {
            // eslint-disable-next-line no-console
            console.log('before:show');
            content.querySelector('img').classList.add('test');
        },
        beforeHide: () => {
            // eslint-disable-next-line no-console
            console.log('before:Hide');
        }
    });
};
