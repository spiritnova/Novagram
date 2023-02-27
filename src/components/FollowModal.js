import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import Follower from "./Follower";
import Wrapper from "./UI Kit/Wrapper";
import styles from './FollowModal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FollowModal({follows, close}){

    const darkTheme = useTheme()

    return(
        <Wrapper>
        <div className={styles.backdrop} onClick={close}></div>
        <div className={`${darkTheme ? styles.modal : styles['modal-light']}`}>
          <div className={`${darkTheme ? styles.title : styles['title-light']}`}>
            <span>Followers</span>
            <button><FontAwesomeIcon icon={faXmark} onClick={close}/></button>
          </div>
          {follows.length !== 0 ?  follows.map(follow => (
            <Follower key={follow.username} username={follow.username} name={follow.name} picture={follow.picture} type='follower'/>
          )): <div className={styles.negative}><span>You don't have any followers</span></div>}
        </div>
      </Wrapper>
    )
}