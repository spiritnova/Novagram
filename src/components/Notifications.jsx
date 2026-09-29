import { forwardRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './Notifications.module.css'

const Notifications = forwardRef((props, ref) => {

    const darkTheme = useTheme()
    return(
        <div className={`${darkTheme ? styles.container : styles['container-light']}`} ref={ref}>
            <h3>Notifications</h3>

            <h5>This week</h5>
            <div className={styles.notifs}>
                <div className={styles.notif}>
                    <div className={styles.details}>
                        <div className={`${darkTheme ? styles.picture : styles['picture-light']}`}></div>
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
                        <div className={`${darkTheme ? styles.picture : styles['picture-light']}`}></div>
                        <div className={styles.message}>
                            <div>cyber_neon liked your picture <span className={styles.date}>3d</span></div>
                        </div>
                    </div>

                    <div className={styles.object}>
                        <div className={`${darkTheme ? styles.pic : styles['pic-light']}`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Notifications;