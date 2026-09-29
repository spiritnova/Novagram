import styles from './Logo.module.css'

// The app mark with the name beside it. The image is decorative, so the visible name is what screen readers get.
export default function Logo({ size = 32, showName = true, className = '', nameClassName = '' }) {
    return (
        <span className={`${styles.logo} ${className}`}>
            <img src="/logo-mark.webp" alt="" width={size} height={size} />
            {showName && <span className={`${styles.name} ${nameClassName}`}>Novagram</span>}
        </span>
    )
}
