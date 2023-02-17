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
    return (
        <div className={styles["profile-info"]}>
        <div>
          <span>
            <b>{postCount ?? 0}</b>
          </span>{" "}
          posts
        </div>
        <button className={styles.followBtn} onClick={followersClick}>
          <span>
            <b>{differentProfile 
                ? userFollowersLength
                : followersLength
              }
            </b>
          </span>{" "}
          followers
        </button>
        <button className={styles.followBtn} onClick={followingClick}>
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