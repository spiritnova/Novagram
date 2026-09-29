import styles from './Settings.module.css'
import Button from '../../components/UI Kit/Button'
import Switch from '../../components/UI Kit/Switch'
import { Skeleton } from '../../components/UI Kit/Skeleton'
import useSettings from './useSettings'

export default function PrivacySecurity(){
    const { settings, isPending, isError, refetch, save } = useSettings()

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Privacy</h2>
            <p className={styles.lead}>Control who sees your account and what they can see about it.</p>

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
                    <div className={styles.row}><Skeleton style={{ height: '3rem', flex: 1 }} /></div>
                    <div className={styles.row}><Skeleton style={{ height: '3rem', flex: 1 }} /></div>
                </div>
            )}

            {settings && (
                <div className={styles.card}>
                    <div className={styles.row}>
                        <div className={styles.rowText}>
                            <div id="setting-private" className={styles.rowTitle}>Private account</div>
                            <p className={styles.rowDesc}>
                                When your account is private, only people you approve can see your posts.
                                Your existing followers won't be affected.
                            </p>
                        </div>
                        <Switch
                            checked={settings.privateAccount}
                            onChange={(value) => save({ privateAccount: value })}
                            aria-labelledby="setting-private"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.rowText}>
                            <div id="setting-activity" className={styles.rowTitle}>Show activity status</div>
                            <p className={styles.rowDesc}>
                                Let accounts you follow and anyone you message see when you were last active.
                                If you turn this off, you won't see theirs either.
                            </p>
                        </div>
                        <Switch
                            checked={settings.activityStatus}
                            onChange={(value) => save({ activityStatus: value })}
                            aria-labelledby="setting-activity"
                        />
                    </div>
                </div>
            )}

            <p className={styles.hint}>This is a demo, so these preferences are saved but don't change what other accounts can see.</p>
        </section>
    )
}
