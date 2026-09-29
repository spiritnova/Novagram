import styles from './PrivacySecurity.module.css'

export default function PrivacySecurity(){
    return(
        <div className={styles['profile-wrapper']}>
           <div className={styles['privacy-wrapper']}>
                <div className={styles['privacy-container']}>
                    <p>Account privacy</p>
                    <div className={styles['privacy-input']}>
                        <input type="checkbox"/>
                        <label>Private account</label>
                    </div>
                    <p className={styles.para3}>When your account is private, only people you approve can see your photos and videos on Novagram.
                    Your existing followers won't be affected.</p>
                    <div className={styles.line}></div>
                </div>


                <div className={styles['privacy-container']}>
                    <p>Account Status</p>
                    <div className={styles['privacy-input']}>
                        <input type="checkbox"/>
                        <label>Show Activity Status</label>
                    </div>
                    <p className={styles.para3}>Allow accounts you follow and anyone you message to see when you were last active or are currently active on Novagram apps.
                     When this is turned off, you won't be able to see the Activity Status of other accounts.</p>

                     <p className={styles.para3}>You can continue to use our services if active status is off.</p>
                    <div className={styles.line}></div>
                </div>

                <div className={styles['privacy-container']}>
                    <p>Story</p>

                    <button className={styles['privacy-buttons']}>Edit story settings</button>
                    <div className={styles.line}></div>
                </div>

                <div className={styles['privacy-container']}>
                    <p>Comments</p>

                    <button className={styles['privacy-buttons']}>Edit comment settings</button>
                    <div className={styles.line}></div>
                </div>

                <div className={styles['privacy-container']}>
                    <p>Two-Factor-Authentication</p>

                    <button className={styles['privacy-buttons']}>Edit Two-Factor-Authentication</button>
                    <div className={styles.line}></div>
                </div>
           </div>
        </div>
    )
}