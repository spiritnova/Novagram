import { Check, Moon, Sun } from 'lucide-react'
import styles from './Settings.module.css'
import { useTheme, useThemeUpdate } from '../../context/ThemeContext'

const THEMES = [
    { id: 'light', label: 'Light', icon: Sun, preview: styles.previewLight },
    { id: 'dark', label: 'Dark', icon: Moon, preview: styles.previewDark },
]

export default function Appearance(){
    const darkTheme = useTheme()
    const toggleTheme = useThemeUpdate()
    const current = darkTheme ? 'dark' : 'light'

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Appearance</h2>
            <p className={styles.lead}>Pick how Novagram looks. Your choice is remembered on this device.</p>

            <div className={styles.themes} role="radiogroup" aria-label="Theme">
                {THEMES.map(({ id, label, icon: Icon, preview }) => (
                    <button
                        key={id}
                        role="radio"
                        aria-checked={current === id}
                        className={`${styles.theme} ${current === id ? styles.themeSelected : ''}`}
                        onClick={() => { if (current !== id) toggleTheme() }}
                    >
                        <div className={`${styles.preview} ${preview}`} aria-hidden="true">
                            <span /><span /><span />
                        </div>
                        <div className={styles.themeName}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <Icon size={16} aria-hidden="true" /> {label}
                            </span>
                            {current === id && <Check size={18} aria-hidden="true" />}
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}
