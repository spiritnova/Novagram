import Logo from '../../components/Logo'
import styles from './Auth.module.css'


// The photos in the brand panel. They are decoration only, so they have no alt text.
const COLUMNS = [
    ['mountains', 'pasta'],
    ['desert', 'camera', 'street'],
    ['yoga', 'street'],
]

// Shared frame for login and register: a brand panel beside the form on wide screens,
// and the same gradient as the page background with the form floating on it on phones.
export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className={styles.page}>
            <section className={styles.brand}>
                <div className={styles.collage} aria-hidden="true">
                    {COLUMNS.map((column, i) => (
                        <div key={i} className={styles.column}>
                            {column.map((name, j) => (
                                <img key={j} src={`/auth/${name}.webp`} alt="" width="360" height="480" loading="lazy" decoding="async" />
                            ))}
                        </div>
                    ))}
                </div>

                <div className={styles.brandBottom}>
                    <p className={styles.headline}>Share the moments that matter.</p>
                    <p className={styles.tagline}>Stories, messages, and a feed of everyone you follow, all in one place.</p>
                </div>
            </section>

            <section className={styles.formSide}>
                <div className={styles.card}>
                    <Logo size={52} className={styles.authLogo} />

                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>

                    {children}
                </div>
            </section>
        </div>
    )
}
