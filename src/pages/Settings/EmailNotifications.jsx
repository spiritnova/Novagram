import styles from './EmailNotifications.module.css'

export default function EmailNotifications(){
    return(
        <div className={styles.wrapper}>
            <div className={styles['radio-container']}>
                <div className={styles.radios}>
                    <p>Feedback Emails</p>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='Off' name="feedback"/>
                        <label>Off</label>
                    </div>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='On' name="feedback"/>
                        <label>On</label>
                    </div>

                    <p className={styles.note}>Give feedback on Novagram</p>
                    <div className={styles.line}></div>
                </div>

                <div className={styles.radios}>
                    <p>Reminder Emails</p>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='Off' name="reminder"/>
                        <label>Off</label>
                    </div>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='On' name="reminder"/>
                        <label>On</label>
                    </div>

                    <p className={styles.note}>Get notifications you might have missed</p>
                    <div className={styles.line}></div>
                </div>

                <div className={styles.radios}>
                    <p>News Emails</p>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='Off' name="news"/>
                        <label>Off</label>
                    </div>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='On' name="news"/>
                        <label>On</label>
                    </div>

                    <p className={styles.note}>Learn about new Novagram features.</p>
                    <div className={styles.line}></div>
                </div>

                <div className={styles.radios}>
                    <p>Support Emails</p>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='Off' name="support"/>
                        <label>Off</label>
                    </div>
                    <div className={styles.radio}>
                        <input type="radio" placeholder='On' name="support"/>
                        <label>On</label>
                    </div>

                    <p className={styles.note}>Get updates on reports and violations of our Community Guidelines.</p>
                    <div className={styles.line}></div>
                </div>
            </div>
        </div>
    )
}