import styles from './Login.module.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';


export default function Register(){
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState();

    const [enteredUsername, setEnteredUsername] = useState('');
    const [usernameIsValid, setUsernameIsValid] = useState();

    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState();

    const [formIsValid, setFormIsValid] = useState(false)

    useEffect(() => {
        setFormIsValid(
            enteredPassword.trim().length >= 8 && enteredUsername.trim().length >= 4 && enteredPassword === enteredConfirmPassword
        )
    },[enteredPassword, enteredUsername, enteredConfirmPassword])

    const usernameChangeHandler =(e) => {
        setEnteredUsername(e.target.value)
    }

    const validateUsernameHandler = () => {
        setUsernameIsValid(enteredUsername.trim().length >= 4)
    }

    const passwordChangeHandler = (e) => {
        setEnteredPassword(e.target.value)  
    }

    const validatePasswordHandler = () => {
        setPasswordIsValid(enteredPassword.trim().length >= 8);
    }

    const confirmPasswordChangeHandler = e => {
        setEnteredConfirmPassword(e.target.value)
    }

    const validateConfirmPassword = () => {
        setConfirmPasswordIsValid(enteredPassword === enteredConfirmPassword)
    }

    return(
        <div className={styles.wrapper}>
            <form>
                <div className={styles.cover}>
                    <h1>Register</h1>
                    <input 
                    className={`${styles.inputs} ${usernameIsValid ? '' : styles['inputs-disabled']}`} 
                    type='text' 
                    placeholder="username"
                    value={enteredUsername}
                    onChange={usernameChangeHandler}
                    onBlur={validateUsernameHandler}
                    />
                    {!usernameIsValid ? <li className={styles['password-error']}>Username must contain at least 4 letters</li> : ''}
                    <input 
                        className={`${styles.inputs} ${passwordIsValid ? '' : styles['inputs-disabled']}`}
                        type='password' 
                        placeholder="password"
                        value={enteredPassword}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                    {!passwordIsValid ? <li className={styles['password-error']}>Password must contain at least 8 characters</li> : ''}
                    <input 
                        className={`${styles.inputs} ${confirmPasswordIsValid ? '' : styles['inputs-disabled']}`}
                        type='password' 
                        placeholder="confirm password" 
                        value={enteredConfirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={validateConfirmPassword}
                    />
                    {!confirmPasswordIsValid ? <li className={styles['password-error']}>Passwords do not match</li> : ''}
                    <button className={formIsValid ? styles.loginBtn : styles['loginBtn-disabled']} disabled={!formIsValid}>Register</button>

                    <p>Already have an account? <Link to="/login" className={styles.links}>Log in</Link></p>
                    <p>Or</p>
                    <div className={styles.media}>
                        <img src='https://cdn-icons-png.flaticon.com/512/1384/1384053.png' className={styles.facebook} alt="facebook"></img>
                        Sign up with Facebook
                    </div>
                </div>
            </form>
        </div>
    )
}