/**
 * classList Add/Remove util
 */
export function classListAdd(
  element: HTMLElement | SVGElement,
  className: string | string[]
) {
  if (Array.isArray(className)) {
    element.classList.add(...className);
  } else {
    element.classList.add(className);
  }
}
export function classListRemove(
  element: HTMLElement | SVGElement,
  className: string | string[]
) {
  if (Array.isArray(className)) {
    element.classList.remove(...className);
  } else {
    element.classList.remove(className);
  }
}
