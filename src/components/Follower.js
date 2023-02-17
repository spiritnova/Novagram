import styles from './Follower.module.css'

export default function Follower({username, name, picture}){

    const defaultImage = username.charAt(0).toUpperCase()
    return(
        <div className={styles.userContainer}>
            <div className={styles.user}>
                <div className={styles.userPicture} style={{backgroundColor: picture ? '' : 'white'}}>
                {picture ?  <img alt="follower" src={picture ? picture : defaultImage}></img> : <span>{defaultImage}</span>}
                </div>
                <div className={styles.userInfo}>
                    <div>{username}</div>
                    <div>{name}</div>
                </div>
            </div>
            <div className={styles.remove}>
                <button>Remove</button>
            </div>
        </div>
    )
}