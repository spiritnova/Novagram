import { useTheme } from '../context/ThemeContext'
import styles from './ProfileInfo.module.css'

export default function ProfileInfo({
    followersClick,
    followingClick,
    differentProfile,
    postCount,
    userFollowersLength,
    userFollowingLength,
    followersLength, 
    followingLength,
}){

    const darkTheme = useTheme()

    return (
        <div className={styles["profile-info"]}>
        <div className={styles.followDiv}>
          <span>
            <b>{postCount ?? 0}</b>
          </span>{" "}
          posts
        </div>
        <button className={`${darkTheme ? styles.followBtn : styles['followBtn-light']}`} onClick={followersClick} disabled={differentProfile}>
          <span>
            <b>{differentProfile 
                ? userFollowersLength
                : followersLength
              }
            </b>
          </span>{" "}
          followers
        </button>
        <button className={`${darkTheme ? styles.followBtn : styles['followBtn-light']}`} onClick={followingClick} disabled={differentProfile}>
          <span>
            <b>{differentProfile
            ? userFollowingLength
            : followingLength
            }
          </b>
          </span>{" "}
          following
        </button>
      </div>
    )
}