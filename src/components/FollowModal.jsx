import { X as XIcon } from 'lucide-react'
import { useTheme } from "../context/ThemeContext";
import Follower from "./Follower";
import Wrapper from "./UI Kit/Wrapper";
import styles from './FollowModal.module.css'
import { unfollowUser } from "../mock/api";

export default function FollowModal({follows, close, name, profileUsername, viewerUsername, onChanged}){

    const darkTheme = useTheme()

    const canManage = profileUsername && viewerUsername && profileUsername === viewerUsername
    const type = name === 'Followers' ? 'follower' : 'following'

    const removeHandler = (targetUsername) => {
      if(!canManage) return

      const removePromise = type === 'follower'
        ? unfollowUser(targetUsername, profileUsername) // that follower unfollows me
        : unfollowUser(profileUsername, targetUsername) // I unfollow them

      removePromise.then(() => onChanged?.())
    }

    return(
        <Wrapper>
        <div className={styles.backdrop} onClick={close}></div>
        <div className={styles.wrapper}>
          <div className={`${darkTheme ? styles.modal : styles['modal-light']}`}>
            <div className={`${darkTheme ? styles.title : styles['title-light']}`}>
              <span>{name}</span>
              <button onClick={close} aria-label="Close"><XIcon size="1em" aria-hidden="true" /></button>
            </div>
            {follows?.length && follows.length !== 0
            ?  follows.map(follow => (
              <Follower
                key={follow.username}
                username={follow.username}
                name={follow.name}
                picture={follow.picture}
                type={type}
                close={close}
                onRemove={canManage ? () => removeHandler(follow.username) : undefined}
              />
            ))
            : <div className={styles.negative}>
                <span>{name === 'Followers' ? "You don't have any followers" : "You are not following anyone"}</span>
              </div>}
          </div>
        </div>
      </Wrapper>
    )
}