import { useTheme } from '../context/ThemeContext'
import styles from './ProfileInfoMobile.module.css'

export default function ProfileInfoMobile({
    followersClick,
    followingClick,
    differentProfile,
    postCount,
    userQuery
}){

    const darkTheme = useTheme()
    return (
        <div className={styles["profile-info"]}>
            <div className={styles.box}>
                <div className={styles.followDiv}>
                    <span>
                        <b>{postCount ?? 0}</b>
                    </span>{" "}
                    posts
                </div>
            </div>

            <div className={styles.box}>
                <button className={`${darkTheme ? styles.followBtn : styles['followBtn-light']}`} onClick={followersClick} disabled={differentProfile}>
                    <span>
                        <b>{differentProfile 
                            ? userQuery.data?.data.user_followers.length
                            : userQuery.data?.data.followers.length
                        }
                        </b>
                    </span>{" "}
                    followers
                </button>
            </div>

            <div className={styles.box}>
                <button className={`${darkTheme ? styles.followBtn : styles['followBtn-light']}`} onClick={followingClick} disabled={differentProfile}>
                    <span>
                        <b>{differentProfile
                        ? userQuery.data?.data.user_following.length
                        : userQuery.data?.data.following.length
                        }
                    </b>
                    </span>{" "}
                    following
                </button>
            </div>
        </div>
    )
}