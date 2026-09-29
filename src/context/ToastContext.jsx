import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Popup from '../components/UI Kit/Popup'

const ToastContext = createContext(() => {})

export function useToast() {
    return useContext(ToastContext)
}

export function ToastProvider({ children }) {
    const [message, setMessage] = useState('')
    const timer = useRef()

    const showToast = useCallback((text) => {
        clearTimeout(timer.current)
        setMessage(text)
        timer.current = setTimeout(() => setMessage(''), 2500)
    }, [])

    useEffect(() => () => clearTimeout(timer.current), [])

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {/* the live region must exist before its text changes, or screen readers miss it */}
            <div className="sr-only" role="status" aria-live="polite">{message}</div>
            {message && <Popup message={message} />}
        </ToastContext.Provider>
    )
}
