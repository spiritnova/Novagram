import { forwardRef } from 'react';
import styles from './Notifications.module.css'

const Notifications = forwardRef((props, ref) => {
    return(
        <div className={styles.container} ref={ref}>
            <h3>Notifications</h3>

            <h5>This week</h5>
            <div className={styles.notifs}>
                <div className={styles.notif}>
                    <div className={styles.details}>
                        <div className={styles.picture}></div>
                        <div className={styles.message}>
                            <div>johndoe123 started following you <span className={styles.date}>1d</span></div>
                        </div>
                    </div>

                    <div className={styles.object}>
                        <button>Following</button>
                    </div>
                </div>

                <div className={styles.notif}>
                    <div className={styles.details}>
                        <div className={styles.picture}></div>
                        <div className={styles.message}>
                            <div>cyber_neon liked your picture <span className={styles.date}>3d</span></div>
                        </div>
                    </div>

                    <div className={styles.object}>
                        <div className={styles.pic}></div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Notifications;