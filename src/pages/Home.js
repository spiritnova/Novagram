import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Wrapper from '../components/UI Kit/Wrapper'
import styles from './Home.module.css'

export default function Home(){

    const username = sessionStorage.getItem('username')

    const homeQuery = useQuery({
        queryKey: ["home", username],
        queryFn : () => axios.post("/", {
          "username": username
        }),
      })

    return(
        <Wrapper>
            <div className={styles.cards}>
              {homeQuery.data?.data.map(post => (
                <div className={styles.card}>
                  <div className={styles.info}>
                    <div className={styles.pfp}></div>
                    <div className={styles.username}>{post.user}</div>
                    <div className={styles.date}>1 week ago</div>
                  </div>

                  <div className={styles.img}>
                    <img alt="posts" src={post.picture}/>
                  </div>

                  <div className={styles.buttons}>
                    <button>
                      <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                    </button>
                    <button>
                      <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                    </button>
                  </div>

                  <div className={styles.footer}>
                    <div>245 likes</div>
                    <div>Comment</div>
                    <button>View all 42 comments</button>
                    <input type="text" placeholder='Add a comment...'></input>
                  </div>
                </div>
              ))}
            </div>
        </Wrapper>
    )
}