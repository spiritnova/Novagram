import styles from './Settings.module.css'

export default function PasswordChange(){

    const picture = localStorage.getItem('picture')
    const user = JSON.parse(localStorage.getItem('user'))

    return(
        <div className={styles['profile-wrapper']}>
            <div className={styles.profile} style={{ marginBottom: 20 }}>
                <div className={styles.imgDiv}>
                    <img src={picture ? picture : user.picture}></img>
                </div>
                <div className={styles.pfp}>
                    <p>lemon_maho</p>
                </div>
            </div>

            <form className={styles['form-container']}>
                <div className={styles.form}>
                    <div className={styles['form-label']}>
                        <label htmlFor="old-password">Old password</label>
                    </div>
                    <div className={styles['form-input']}>
                        <input type="password" id="old-password"></input>
                    </div>
                </div>

                <div className={styles.form}>
                    <div className={styles['form-label']}>
                        <label htmlFor='new-password'>New password</label>
                    </div>
                    <div className={styles['form-input']}>
                        <input type="password" id='new-password'></input>
                    </div>
                </div>

                <div className={styles.form}>
                    <div className={styles['form-label']}>
                        <label htmlFor="confirm-password">Confirm new password</label>
                    </div>
                    <div className={styles['form-input']}>
                        <input type="password" id='confirm-password'></input>
                    </div>
                </div>
                <div className={styles['cp-btn-div']}>
                    <button className={styles['submit-btn']} type='submit'>Change password</button>
                </div>
                    <button className={styles['forgot-password']}>Forgot password?</button>
            </form>
        </div>
    )
}