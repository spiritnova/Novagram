import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import styles from './Follower.module.css'

export default function Follower({username, name, picture, type}){

    const defaultImage = username.charAt(0).toUpperCase()

    const darkTheme = useTheme()
    return(
        <div className={styles.userContainer}>
            <div className={styles.user}>
                <div className={styles.userPicture} style={{backgroundColor: picture ? '' : 'white'}}>
                {picture ?  <img alt="follower" src={picture ? picture : defaultImage}></img> : <span>{defaultImage}</span>}
                </div>
                <div className={`${darkTheme ? styles.userInfo : styles['userInfo-light']}`}>
                    <Link to={`/${username}`}>
                        <div>{username}</div>
                        <div>{name}</div>
                    </Link>
                </div>
            </div>
            <div className={`${darkTheme ? styles.remove : styles['remove-light']}`}>
                <button>{type !== 'follower' ? 'Unfollow' : 'Remove'}</button>
            </div>
        </div>
    )
}