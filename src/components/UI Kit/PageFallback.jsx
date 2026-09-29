import styles from './PageFallback.module.css'

// Shown while a route's code is downloading. It fades in after a short delay so quick loads don't flash.
export default function PageFallback() {
    return (
        <div className={styles.fallback} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span className="sr-only">Loading page</span>
        </div>
    )
}
