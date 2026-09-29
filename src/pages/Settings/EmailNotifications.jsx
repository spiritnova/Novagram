import styles from './Settings.module.css'
import Button from '../../components/UI Kit/Button'
import Switch from '../../components/UI Kit/Switch'
import { Skeleton } from '../../components/UI Kit/Skeleton'
import useSettings from './useSettings'

const OPTIONS = [
    { key: 'feedback', title: 'Feedback emails', description: 'Give feedback on Novagram.' },
    { key: 'reminders', title: 'Reminder emails', description: 'Get notifications you might have missed.' },
    { key: 'news', title: 'News emails', description: 'Learn about new Novagram features.' },
    { key: 'support', title: 'Support emails', description: 'Updates on your reports and on violations of our Community Guidelines.' },
]

export default function EmailNotifications(){
    const { settings, isPending, isError, refetch, save } = useSettings()

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Notifications</h2>
            <p className={styles.lead}>Choose which emails Novagram sends you.</p>

            {isError && (
                <div className={styles.card}>
                    <div className={styles.row}>
                        <span>Couldn't load your settings.</span>
                        <Button size="sm" onClick={() => refetch()}>Try again</Button>
                    </div>
                </div>
            )}

            {isPending && !isError && (
                <div className={styles.card} role="status" aria-label="Loading settings">
                    {OPTIONS.map(o => (
                        <div key={o.key} className={styles.row}>
                            <Skeleton style={{ height: '2.5rem', flex: 1 }} />
                        </div>
                    ))}
                </div>
            )}

            {settings && (
                <div className={styles.card}>
                    {OPTIONS.map(({ key, title, description }) => (
                        <div key={key} className={styles.row}>
                            <div className={styles.rowText}>
                                <div id={`email-${key}`} className={styles.rowTitle}>{title}</div>
                                <p className={styles.rowDesc}>{description}</p>
                            </div>
                            <Switch
                                checked={settings.emails[key]}
                                onChange={(value) => save({ emails: { [key]: value } })}
                                aria-labelledby={`email-${key}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
