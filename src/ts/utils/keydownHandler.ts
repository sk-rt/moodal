export const keydownHandler = (
  wrapper: HTMLElement,
  keys: string[],
  onKeyDown: (e: KeyboardEvent) => void = () => {},
  options: EventListenerOptions = undefined
) => {
  const handKeyDown = (e: KeyboardEvent) => {
    if (keys.indexOf(e.key) !== -1) {
      onKeyDown(e);
      return;
    }
  };
  wrapper.addEventListener('keydown', handKeyDown, options);
  return () => {
    wrapper.removeEventListener('keydown', handKeyDown);
  };
};
