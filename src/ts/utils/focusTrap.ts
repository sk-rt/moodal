/**
 * Focus trap
 */
import { keydownHandler } from './keydownHandler';
export const addFocusTrap = (wrapper: HTMLElement) => {
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  const focusableElements: HTMLElement[] = [].slice.call(
    wrapper.querySelectorAll<HTMLElement>(focusableElementsString)
  );
  if (focusableElements.length === 0) {
    return () => {};
  }
  const originalActiveElement = document.activeElement as HTMLElement;
  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];
  firstTabStop.focus();
  const removeLisner = keydownHandler(wrapper, ['Tab'], (e) => {
    if (e.shiftKey) {
      if (document.activeElement === firstTabStop) {
        e.preventDefault();
        lastTabStop.focus();
      }
    } else {
      if (document.activeElement === lastTabStop) {
        e.preventDefault();
        firstTabStop.focus();
      }
    }
  });
  return () => {
    removeLisner();
    originalActiveElement.focus();
  };
};
