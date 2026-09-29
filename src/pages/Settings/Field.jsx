import { useId } from 'react'
import styles from './Settings.module.css'

// A labelled form control with an optional hint and error, wired up for screen readers.
// Renders a textarea when multiline is set; extra props go to the control.
export default function Field({ label, error, hint, counter, multiline, children, ...props }) {
    const id = useId()
    const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
    const Control = multiline ? 'textarea' : 'input'

    return (
        <div className={styles.field}>
            <div className={styles.labelRow}>
                <label htmlFor={id}>{label}</label>
                {counter}
            </div>
            <div className={styles.control}>
                <Control
                    id={id}
                    className={`${styles.input} ${error ? styles.invalid : ''}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    {...props}
                />
                {children}
            </div>
            {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
            {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
        </div>
    )
}
