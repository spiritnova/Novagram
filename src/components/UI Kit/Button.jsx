import styles from './Button.module.css'

// One button for the whole app. Pass as={Link} (with "to") for a link that looks like a button.
// variant: primary | secondary | danger | ghost, size: md | sm
export default function Button({ as: Component = 'button', variant = 'secondary', size = 'md', className = '', ...props }) {
    return (
        <Component
            className={`${styles.button} ${styles[variant]} ${size === 'sm' ? styles.sm : ''} ${className}`}
            {...props}
        />
    )
}
