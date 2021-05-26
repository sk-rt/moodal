/**
 * `window.scrollY` polyfill
 */
const getScrollOffset = (): number =>
  window.pageYOffset !== undefined
    ? window.pageYOffset
    : (
        document.documentElement ||
        (document.body.parentNode as any) ||
        document.body
      ).scrollTop;
export default getScrollOffset;
