import styles from './Login.module.css'
import { useEffect, useRef, useState} from 'react'
import { useTheme } from '../ThemeContext';
import { Link } from 'react-router-dom';

export default function Login(props){
    const passwordRef = useRef()
    const usernameRef = useRef()

    const darkTheme = useTheme()

    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("/users")
        .then(res => res.json())
        .then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, [])


    const formSubmissionHandler = (e) => {
        e.preventDefault();

        if(usernameRef.current.value === ''){
            return
        }

        if(passwordRef.current.value === ''){
            return
        }

        props.onLogin()
    }
    
    return(
        <div className={styles.wrapper}>
            <form onSubmit={formSubmissionHandler}>
                <div className={`${styles.cover} ${darkTheme ? '' : styles['cover-light']} `}>
                    <h1>Login</h1>
                    <input 
                    className={styles.inputs} 
                    type='text' 
                    placeholder="username" 
                    ref={usernameRef}
                    />
                    <input 
                        className={styles.inputs}
                        type='password' 
                        placeholder="password" 
                        ref={passwordRef}
                    />
                    <button className={styles.loginBtn}>Login</button>

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