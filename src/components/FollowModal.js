import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import Follower from "./Follower";
import Wrapper from "./UI Kit/Wrapper";
import styles from './FollowModal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FollowModal({follows, close, name}){

    const darkTheme = useTheme()

    return(
        <Wrapper>
        <div className={styles.backdrop} onClick={close}></div>
        <div className={`${darkTheme ? styles.modal : styles['modal-light']}`}>
          <div className={`${darkTheme ? styles.title : styles['title-light']}`}>
            <span>{name}</span>
            <button><FontAwesomeIcon icon={faXmark} onClick={close}/></button>
          </div>
          {follows.length && follows.length !== 0 
          ?  follows.map(follow => (
            <Follower 
              key={follow.username} 
              username={follow.username} 
              name={follow.name} 
              picture={follow.picture} 
              type='follower'
              close={close}
            />
          ))
          : <div className={styles.negative}>
              <span>{name === 'Followers' ? "You don't have any followers" : "You are not following anyone"}</span>
            </div>}
        </div>
      </Wrapper>
    )
}