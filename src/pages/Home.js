import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Wrapper from '../components/UI Kit/Wrapper'
import styles from './Home.module.css'
import sendComment from '../api/sendComment'
import Post from './Profile/Post'

export default function Home(){
    const [showPostButton, setShowPostButton] = useState(false)
    const [enteredComment ,setEnteredComment] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [postId, setPostId] = useState()

    const location = useLocation();

    const username = sessionStorage.getItem('username')
    const user_id = sessionStorage.getItem('user_id')
    
    const comment = useRef()
    const postBtn = useRef()

    const homeQuery = useQuery({
        queryKey: ["home", username],
        queryFn : () => axios.post("/", {
          "username": username
        }),
      })

    const commentChangeHandler = (e) => {
      setEnteredComment(e.target.value)
      if(e.target.value !== '')
      {
        setShowPostButton(true)
      }
      else{
        setShowPostButton(false)
      }
    }

    return(
        <Wrapper>
          <Outlet/>
            <div className={styles.cards}>
              {homeQuery.data?.data.map(post => (
                <div key={post.id} className={styles.card}>
                  <div className={styles.info}>
                    <div className={styles.pfp}></div>
                    <div className={styles.username}>
                      <Link to={`profile/${post.user}`}>
                        {post.user}
                      </Link>
                    </div>
                    <div className={styles.date}>1 week ago</div>
                  </div>

                  <div className={styles.img}>
                    <img alt="posts" src={post.picture} onClick={() => {
                      setShowModal(true)
                      setPostId(post.id)
                    }}/>
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
                    <div className={styles.post}>
                      <input 
                      type="text" 
                      ref={comment} 
                      onChange={commentChangeHandler} 
                      placeholder='Add a comment...'
                      value={enteredComment}
                      />
                      {showPostButton && <button onClick={() => {
                        sendComment({
                          comment : comment.current.value,
                          user_id: user_id,
                          id : post.id
                        })
                        setEnteredComment('')
                      }} ref={postBtn}>Post</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          {showModal &&
            <Post 
              onClose={() => setShowModal(false)}
              realRoute={location.pathname}
              pseudoRoute={`/post/${postId}`}
            />
          }
        </Wrapper>
    )
}