import styles from './Login.module.css'
import { useState, useEffect} from 'react'
import { useTheme } from '../ThemeContext';
import { Link } from 'react-router-dom';

export default function Login(props){
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const [enteredUsername, setEnteredUsername] = useState('');
    const [usernameIsValid, setUsernameIsValid] = useState(true);

    const [formIsValid, setFormIsValid] = useState(false)

    const darkTheme = useTheme()


    useEffect(() => {
        const identifier = setTimeout(() => {
           setFormIsValid(enteredUsername.trim().length >=4 && enteredPassword.trim().length >=8)
        }, 500);

        return () => {
            clearTimeout(identifier)
        }
    },[enteredUsername, enteredPassword])


    const usernameChangeHandler =(e) => {
        setEnteredUsername(e.target.value)
    }

    const passwordChangeHandler = (e) => {
        setEnteredPassword(e.target.value)  
    }

    const formSubmissionHandler = (e) => {
        e.preventDefault();

        if(enteredUsername === '' || enteredUsername.trim().length < 4){
            setUsernameIsValid(false)
            return
        }

        if(enteredPassword === '' || enteredPassword.trim().length < 8){
            setPasswordIsValid(false)
            return
        }


        setPasswordIsValid(enteredPassword.trim().length >= 8 )
        setUsernameIsValid(enteredUsername.trim().length >= 4)

        props.onLogin()
    }
    
    return(
        <div className={styles.wrapper}>
            <form onSubmit={formSubmissionHandler}>
                <div className={`${styles.cover} ${darkTheme ? '' : styles['cover-light']} `}>
                    <h1>Login</h1>
                    <input 
                    className={`${styles.inputs} ${usernameIsValid ? '' : styles['inputs-disabled']}`} 
                    type='text' 
                    placeholder="username" 
                    value={enteredUsername}
                    onChange={usernameChangeHandler}
                    />
                    {!usernameIsValid && <p>Invalid Username</p>}
                    <input 
                        className={`${styles.inputs} ${passwordIsValid ? '' : styles['inputs-disabled']}`} 
                        type='password' 
                        placeholder="password" 
                        value={enteredPassword}
                        onChange={passwordChangeHandler} 
                    />
                    {!passwordIsValid && <p>Invalid Password</p>}
                    <button className={formIsValid ? styles.loginBtn : styles['loginBtn-disabled']} disabled={!formIsValid}>Login</button>

                    <p>Don't have an account? <Link to="/register" className={styles.links}>Sign up</Link></p>
                    <p>Or</p>
                    <div className={styles.media}>
                        <img src='https://cdn-icons-png.flaticon.com/512/1384/1384053.png' className={styles.facebook} alt="facebook"></img>
                        Login with Facebook
                    </div>
                </div>
            </form>
        </div>
    )
}