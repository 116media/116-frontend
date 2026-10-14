/**
 * ModalSlotDefault
 *
 * @description
 * The `@modal` slot's resting state. Every route that is not an intercepted overlay
 * renders nothing here, and a hard navigation to one of those routes has a definition to
 * fall back to instead of a 404 in the slot.
 */
export default function ModalSlotDefault() {
    return null;
}
