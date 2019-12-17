/**
 * Element to String
 */
export const domToString = (element: HTMLElement) => {
    return element.outerHTML;
};
/**
 * String to Element
 */
export const stringToElement = (htmlString: string, wrapperTag = 'div') => {
    const wrapperEl = document.createElement(wrapperTag);
    wrapperEl.innerHTML = htmlString;
    return wrapperEl;
};
