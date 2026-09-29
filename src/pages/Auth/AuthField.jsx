import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'

import styles from './Auth.module.css'

// A labelled input. The error or hint is tied to the input for screen readers, and
// password fields get a show/hide button.
export default function AuthField({ label, error, hint, type = 'text', inputRef, children, ...inputProps }) {
    const id = useId()
    const [shown, setShown] = useState(false)
    const isPassword = type === 'password'

    const message = error ? { id: `${id}-error`, text: error, className: styles.error } : hint ? { id: `${id}-hint`, text: hint, className: styles.hint } : null

    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <div className={styles.control}>
                <input
                    id={id}
                    ref={inputRef}
                    type={isPassword && shown ? 'text' : type}
                    className={`${styles.input} ${error ? styles.invalid : ''} ${isPassword ? styles.hasToggle : ''}`}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={message?.id}
                    {...inputProps}
                />
                {isPassword && (
                    <button type="button" className={styles.toggle} onClick={() => setShown(prev => !prev)} aria-label="Show password" aria-pressed={shown}>
                        {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                )}
            </div>
            {message && <p id={message.id} className={message.className}>{message.text}</p>}
            {children}
        </div>
    )
}
