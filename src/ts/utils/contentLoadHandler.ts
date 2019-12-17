/**
 * img,iframeの読み込み監視
 * @param content
 * @param timeOut
 * @return Promise
 */
export const contentLoadHandler = (
    content: HTMLElement | Document,
    timeOut = 2000
): Promise<null> => {
    const mediaEls: (HTMLImageElement | HTMLIFrameElement)[] = [].slice.call(
        content.querySelectorAll('img,iframe')
    );
    const length = mediaEls.length;
    return new Promise(resolve => {
        let loadedNum = 0;
        let isLoaded = false;
        if (length === 0) {
            isLoaded = true;
            resolve();
            return;
        }
        mediaEls.forEach(element => {
            element.addEventListener('load', () => {
                if (isLoaded) return;
                loadedNum++;
                if (loadedNum === length) {
                    isLoaded = true;
                    resolve();
                }
            });
        });

        // ロードイベントのフォールバック;
        setTimeout(() => {
            if (isLoaded) return;
            isLoaded = true;
            resolve();
        }, timeOut);
    });
};
