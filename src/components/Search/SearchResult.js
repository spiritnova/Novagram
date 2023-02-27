import { useTheme } from '../../context/ThemeContext'
import styles from './Search.module.css'
import { Link } from 'react-router-dom'

export default function SearchResult({user}){

    const darkTheme = useTheme()

    const username = user.username.toString()

    const defaultImage = username.charAt(0).toUpperCase()

    console.log(defaultImage)

    return (
        <div key={user.username} className={styles.result}>
            <div className={`${darkTheme ? styles.picture : styles['picture-light']}`}>
                {user.picture ? <img alt={`${user.username}'s pfp`} src={user.picture}/> : defaultImage}
            </div>
            <div className={`${darkTheme ? styles.name : styles['name-light']}`}>
                <Link to={`/${user.username}`}>
                    <div>{user.username}</div>
                </Link>
                <div>{user.name}</div>
            </div>
        </div>
    )
}