import { useEffect, useRef } from 'react'

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]',
].map(selector => `${selector}:not([tabindex="-1"])`).join(', ')

// Open dialogs, top of the stack last, so only the one on top reacts to Escape and Tab
const stack = []
let scrollLocks = 0

const visible = (element) => element.getClientRects().length > 0

/*
 * Modal behaviour for a container element:
 * - moves focus inside when it opens and puts it back on the opener when it closes
 * - keeps Tab and Shift+Tab inside the dialog
 * - closes on Escape (only the top-most dialog when several are open)
 * - locks page scroll while any dialog is open
 *
 * `enabled` lets a dialog that is still loading wait until its content exists.
 */
export default function useDialog(ref, { onClose, enabled = true } = {}) {
    const closeRef = useRef(onClose)
    closeRef.current = onClose

    useEffect(() => {
        const container = ref.current
        if (!enabled || !container) return

        const opener = document.activeElement
        const token = {}
        stack.push(token)

        if (scrollLocks++ === 0) document.body.style.overflow = 'hidden'

        if (!container.contains(document.activeElement)) {
            const first = container.querySelector('[data-autofocus]') ?? [...container.querySelectorAll(FOCUSABLE)].find(visible)
            if (first) {
                first.focus()
            } else {
                container.tabIndex = -1
                container.focus()
            }
        }

        const keyHandler = (e) => {
            if (stack[stack.length - 1] !== token) return

            if (e.key === 'Escape') {
                e.stopPropagation()
                closeRef.current?.()
                return
            }

            if (e.key !== 'Tab') return

            const items = [...container.querySelectorAll(FOCUSABLE)].filter(visible)
            if (items.length === 0) {
                e.preventDefault()
                return
            }

            const first = items[0]
            const last = items[items.length - 1]
            const active = document.activeElement

            if (!container.contains(active)) {
                e.preventDefault()
                first.focus()
            } else if (e.shiftKey && active === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && active === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', keyHandler)

        return () => {
            document.removeEventListener('keydown', keyHandler)
            stack.splice(stack.indexOf(token), 1)
            if (--scrollLocks === 0) document.body.style.overflow = ''
            if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
        }
    }, [ref, enabled])
}
