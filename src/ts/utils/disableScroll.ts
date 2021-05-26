/**
 * Fix scroll element
 */
import getScrollOffset from './getScrollOffset';
let scrollTop = 0;
export const disableScroll = (wrapperEl: HTMLElement, addClass = '') => {
  scrollTop = getScrollOffset();
  wrapperEl.style.position = 'fixed';
  wrapperEl.style.left = '0';
  wrapperEl.style.right = '0';
  wrapperEl.style.top = `-${scrollTop}px`;
  if (addClass) wrapperEl.classList.add(addClass);
};
export const enableScroll = (wrapperEl: HTMLElement, removeClass = '') => {
  if (
    !wrapperEl ||
    !('style' in wrapperEl) ||
    wrapperEl.style.position !== 'fixed'
  ) {
    return;
  }
  wrapperEl.style.position = '';
  wrapperEl.style.left = '';
  wrapperEl.style.right = '';
  wrapperEl.style.top = '';
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  });
  if (removeClass) wrapperEl.classList.remove(removeClass);
};
