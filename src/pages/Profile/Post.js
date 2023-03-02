import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './Post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faComment, faEllipsis, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons'
import Wrapper from '../../components/UI Kit/Wrapper'

import sendComment from '../../api/sendComment'
import axios from 'axios'

import { useTheme } from '../../context/ThemeContext'

export default function Post(props){

    const [liked, setIsLiked] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [pfp, setPfp] = useState()

    const queryClient = useQueryClient()

    const darkTheme = useTheme()

    let api = `https://novagram-api.onrender.com/${props.pseudoRoute}`

    useEffect(() => {
        if(props.showModal && props.pseudoRoute){
            window.history.pushState({}, "modal-route", props.pseudoRoute)
        }
    }, [props.showModal, props.pseudoRoute])

    useEffect(() => {
        if(!props.showModal && props.realRoute){
            window.history.pushState({}, "real-route", props.realRoute)
        }
    }, [props.showModal, props.realRoute])

    const username = sessionStorage.getItem('username')

    const id = props.pseudoRoute.slice(6)

    const heart = useRef()
    const comment = useRef()

    const user_id = sessionStorage.getItem('user_id')

    const postQuery = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetch(api)
        .then(res => res.json()),
    })

    const newCommentMutation = useMutation({
        mutationFn: sendComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts", id], { exact: true })
            comment.current.value = ""
        }
    })

    const onLikeHandler = () => {
        setIsLiked(current => !current)

        axios.post('/post/like', {
            post_id: postQuery.data.data.id,
            user_id : user_id,
            status : liked,
        })

        // => This prevents the query from sticking to it's prevState
        queryClient.invalidateQueries(["posts", id], { exact : true} )
    }

    const refsById = useMemo(() => {
        const refs = {}
        postQuery.data?.data.comments.forEach(comment => {
            refs[comment.id] = createRef(null)
        });

        return refs
    }, [postQuery.data?.data.comments])


    useEffect(() => {
        postQuery.data?.data.comments.forEach(comment => {
            comment.likes.forEach((like) => {
                if(like.username === username){
                    refsById[comment.id].current.style.color = 'red'
                }
                else{
                    refsById[comment.id].current.style.color = 'white'
                }
            })
        })
    })
    
    useEffect(() => {

        if(postQuery.data?.data.picture === null){
             setPfp(postQuery.data?.data.username.charAt(0))
        }
    }, [postQuery.data?.data.picture, postQuery.data?.data.username])

    function postDeleteHandler(){
        setShowModal(false)

        axios.post("/post/delete", {
            "id": postQuery.data?.data.id
        })

        queryClient.invalidateQueries(["posts"])
    }

    if(postQuery.isLoading) return <div className={styles.loader}></div>
    if(postQuery.isError) return <pre>{JSON.stringify(postQuery.error.message)}</pre>

    return(
        <Wrapper>
            <div className={styles.backdrop}></div>
            <div className={styles.wrapper}>
                <div className={styles['modal-close']}>
                    <button onClick={props.onClose}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
                <div className={`${darkTheme ? styles.modal : styles['modal-light']}`}>
                    <div className={styles['modal-img']}>
                        <img src={postQuery.data.data.image} alt="postImage"/>
                    </div>
                    <div className={`${darkTheme ? styles['modal-details'] : styles['modal-details-light']}`}>
                        <div className={`${darkTheme ? styles['modal-details-control'] : styles['modal-details-control-light']}`}>
                            <div className={styles['modal-pfp']}>
                                {postQuery.data?.data.picture !== null 
                                ? <img alt="pfp" src={postQuery.data?.data.picture}></img>
                                : pfp
                                }
                                
                            </div>
                            <Link to={`/${postQuery.data?.data.username}`}>
                                <p>{postQuery.data?.data.username}</p>
                            </Link>
                            {username === postQuery.data?.data.username && <button className={`${darkTheme ? styles['modal-post-settings'] : styles['modal-post-settings-light']}`} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faEllipsis}/>
                            </button>}
                        </div>
                        <div className={`${darkTheme ? styles['modal-details-comments']: styles['modal-details-comments-light']}`}>
                            <div className={styles['modal-comment']}>
                                <div className={styles['modal-pfp']}>
                                {postQuery.data?.data.picture !== null 
                                ? <img alt="pfp" src={postQuery.data?.data.picture}></img>
                                : pfp
                                }
                                </div>
                                <div className={styles['modal-comment-container']}>
                                    <div className={`${darkTheme ? styles['modal-comment-details'] : styles['modal-comment-details-light']}`}>
                                        <Link to={`${postQuery.data?.data.username}`}>
                                            <p className={styles['modal-comment-user']}>{postQuery.data?.data.username}</p>
                                        </Link>
                                        <p className={styles['modal-comment-content']}>{postQuery.data.data.caption}</p>
                                    </div>
                                    <div className={styles['modal-comment-date']}>
                                        {postQuery.data.data.date}
                                    </div>
                                </div>
                            </div>
                            {postQuery.data.data.comments.map(comment => (
                            <div key={comment.id} className={styles['modal-comment']}>
                                <div className={styles['modal-pfp']}>
                                    <img alt="pfp" src={comment.picture}></img>
                                </div>
                                <div className={styles['modal-comment-container']}>
                                    <div className={`${darkTheme ? styles['modal-comment-details'] : styles['modal-comment-details-light']}`}>
                                        <p className={styles['modal-comment-user']}>{comment.username}</p>
                                        <p className={styles['modal-comment-content']}>{comment.content}</p>
                                        <button  className={`${darkTheme ? styles['modal-comment-like'] : styles['modal-comment-like-light']}`} 
                                            onClick={() => {
                                                axios.post("/comment/like", {
                                                    id: comment.id,
                                                    post_id: postQuery.data.data.id,
                                                    user_id : user_id,
                                                })
                                            }}
                                            data-key={comment.id}
                                            ref={refsById[comment.id]}
                                            >
                                            <FontAwesomeIcon icon={faHeart}/>
                                        </button>
                                    </div>
                                    <div className={styles['modal-comment-date']}>
                                        2 days ago
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className={`${darkTheme ? styles['modal-details-reactions'] : styles['modal-details-reactions-light']}`}>
                            <div className={styles.icons}>
                                <div className={styles['icons-left']}>
                                    <button 
                                        className={styles.icon} 
                                        ref={heart} onClick={onLikeHandler}
                                        style={postQuery.data.data.likes.length ? {color : 'red'} : {color : 'white'}}
                                    >
                                        <FontAwesomeIcon icon={faHeart}/>
                                    </button>
                                    <button className={`${darkTheme ? styles.icon : styles['icon-light']}`}>
                                        <label for="commentInput">
                                            <FontAwesomeIcon icon={faComment}/>
                                        </label>
                                    </button>
                                </div>
                                <div className={styles['icons-right']}>
                                    <button className={`${darkTheme ? styles.icon : styles['icon-light']}`}>
                                        <FontAwesomeIcon icon={faBookmark}/>
                                    </button>
                                </div>
                            </div>
                            <div></div>
                            <div className={styles['modal-post-date']}><p>{postQuery.data.data.date}</p></div>
                        </div>
                        <div className={`${darkTheme ? styles['modal-details-post'] : styles['modal-details-post-light']}`}>
                            <div>
                                <textarea ref={comment} id="commentInput" type="text" placeholder='Add a comment...'/>
                            </div>
                            <div>
                                <button disabled={postQuery.isLoading} onClick={() => newCommentMutation.mutate({
                                    comment: comment.current.value,
                                    user_id : user_id,
                                    id: id
                                })}>Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <Wrapper>
                <div className={styles['post-backdrop']}>
                    <div className={styles['modal-close']}>
                        <button onClick={() => setShowModal(false)}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </div>
                </div>

                <div className={styles['post-wrapper']}>
                    <div className={styles['post-edit']}>
                        <div className={styles['post-buttons']}>
                            <button onClick={postDeleteHandler}>Delete</button>
                            <button>Edit</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Wrapper>}
        </Wrapper>
    )
}