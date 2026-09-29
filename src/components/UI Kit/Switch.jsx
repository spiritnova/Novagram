import styles from './Switch.module.css'

// An on/off toggle. Pass the visible label through aria-labelledby / aria-label so it is announced.
export default function Switch({ checked, onChange, disabled, ...props }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`${styles.switch} ${checked ? styles.on : ''}`}
            onClick={() => onChange(!checked)}
            {...props}
        >
            <span className={styles.thumb} />
        </button>
    )
}
