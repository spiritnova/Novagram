import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Wrapper from '../components/UI Kit/Wrapper'
import styles from './Home.module.css'
import sendComment from '../api/sendComment'
import Post from './Profile/Post'
import { useTheme } from '../context/ThemeContext'

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

    const darkTheme = useTheme()

    showModal
    ? document.body.style.overflow = 'hidden'
    : document.body.style.overflow = 'auto'

    let api = 'https://novagram-api.onrender.com'

    const homeQuery = useQuery({
        queryKey: ["home", username],
        queryFn : () => axios.post(`${api}/`, {
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
          <div className={styles.wrapper}>
            <div className={styles.cards}>
              {homeQuery.data?.data.length === 0 ? 
              <div className={styles.empty}>
                <h2>NO POSTS FOUND</h2>
                <p>start by following some users or visit the <Link to={'/explore'}>Explore tab</Link></p>
              </div>
               : homeQuery.data?.data.map(post => (
                <div key={post.id} className={styles.card}>
                  <div className={styles.info}>
                    <div className={`${styles.pfp} ${!darkTheme && styles.light}`}></div>
                    <div className={`${styles.username} ${!darkTheme && styles['light-text']}`}>
                      <Link to={`/${post.user}`}>
                        {post.user}
                      </Link>
                    </div>
                    <div className={`${darkTheme ? styles.date : styles['date-light']}`}>1 week ago</div>
                  </div>

                  <div className={styles.img}>
                    <img alt="posts" src={post.picture} onClick={() => {
                      setShowModal(true)
                      setPostId(post.id)
                    }}/>
                  </div>

                  <div className={`${styles.buttons} ${!darkTheme && styles['light-text']}`}>
                    <button>
                      <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                    </button>
                    <button>
                      <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                    </button>
                  </div>

                  <div className={`${darkTheme ? styles.footer : styles['footer-light']}`}>
                    <div>245 likes</div>
                    <div>{post.comment ? <div><b>{post.comment.username}</b> {post.comment.content}</div> : ''}</div>
                      {post.commentLength === 0 
                        ? '' 
                        : <button 
                        onClick={() => {
                          setShowModal(true)
                          setPostId(post.id)
                        }}>View all {post.commentLength} comment(s)</button>}
                    <div className={`${darkTheme ? styles.post : styles['post-light']}`}>
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