import styles from './Container.module.css'

// The main content area next to the sidebar
export default function Container({children}){
    return (
        <main id="main" className={styles.container} tabIndex={-1}>
            {children}
        </main>
    )
}
