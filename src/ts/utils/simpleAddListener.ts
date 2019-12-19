export interface EventOptions {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}
export type RemoveListener = () => void;
const simpleAddListener = (
    target: Window | Document | Element,
    eventType: string,
    listener: EventListener,
    eventOptions: boolean | EventOptions = false
): RemoveListener => {
    const opt =
        typeof eventOptions === 'boolean'
            ? eventOptions
            : {
                  capture: false,
                  once: false,
                  passive: false,
                  ...eventOptions
              };
    target.addEventListener(eventType, listener, opt);
    return () => {
        target.removeEventListener(eventType, listener, eventOptions);
    };
};
export default simpleAddListener;
