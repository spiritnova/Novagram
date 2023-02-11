import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faComment, faEllipsis, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons'
import Wrapper from '../../components/UI Kit/Wrapper'

import sendComment from '../../api/sendComment'
import axios from 'axios'

export default function Post(props){

    const [liked, setIsLiked] = useState(false)

    const { id } = useParams()

    const user = useParams()

    const heart = useRef()

    const user_id = sessionStorage.getItem('user_id')

    const comment = useRef()

    const queryClient = useQueryClient()

    const postQuery = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetch(`/posts/${user.username}/${id}`)
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
                if(like.username === user.username){
                    console.log(refsById[comment.id])
                    refsById[comment.id].current.style.color = 'red'
                }
                else{
                    refsById[comment.id].current.style.color = 'white'
                }
            })
        })
    })


    if(postQuery.isLoading) return <div className={styles.loader}></div>
    if(postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>

    return(
        <Wrapper>
            <div className={styles.backdrop}>
                <div className={styles['modal-close']}>
                    <button onClick={props.onClose}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
            </div>
            <div className={styles.modal}>
                <div className={styles['modal-img']}>
                    <img src={postQuery.data.data.image} alt="postImage"/>
                </div>
                <div className={styles['modal-details']}>
                    <div className={styles['modal-details-control']}>
                        <div className={styles['modal-pfp']}>
                            <img alt="pfp" src={postQuery.data.data.picture}></img>
                        </div>
                        <p>{user.username}</p>
                        <button className={styles['modal-comment-like']}>
                            <FontAwesomeIcon icon={faEllipsis}/>
                        </button>
                    </div>
                    <div className={styles['modal-details-comments']}>
                        <div className={styles['modal-comment']}>
                            <div className={styles['modal-pfp']}>
                                <img alt="pfp" src={postQuery.data.data.picture}></img>
                            </div>
                            <div className={styles['modal-comment-container']}>
                                <div className={styles['modal-comment-details']}>
                                    <p className={styles['modal-comment-user']}>{user.username}</p>
                                    <p className={styles['modal-comment-content']}>{postQuery.data.data.caption}</p>
                                </div>
                                <div className={styles['modal-comment-date']}>
                                    {postQuery.data.data.date}
                                </div>
                            </div>
                        </div>
                        {postQuery.data.data.comments.map((comment, i) => (
                        <div key={comment.id} className={styles['modal-comment']}>
                            <div className={styles['modal-pfp']}>
                                <img alt="pfp" src={comment.picture}></img>
                            </div>
                            <div className={styles['modal-comment-container']}>
                                <div className={styles['modal-comment-details']}>
                                    <p className={styles['modal-comment-user']}>{comment.username}</p>
                                    <p className={styles['modal-comment-content']}>{comment.content}</p>
                                    <button  className={styles['modal-comment-like']} 
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
                    <div className={styles['modal-details-reactions']}>
                        <div className={styles.icons}>
                            <div className={styles['icons-left']}>
                                <button 
                                    className={styles.icon} 
                                    ref={heart} onClick={onLikeHandler}
                                    style={postQuery.data.data.likes.length ? {color : 'red'} : {color : 'white'}}
                                >
                                    <FontAwesomeIcon icon={faHeart}/>
                                </button>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faComment}/>
                                </button>
                            </div>
                            <div className={styles['icons-right']}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                </button>
                            </div>
                        </div>
                        <div></div>
                        <div className={styles['modal-post-date']}><p>{postQuery.data.data.date}</p></div>
                    </div>
                    <div className={styles['modal-details-post']}>
                        <div>
                            <textarea ref={comment} type="text" placeholder='Add a comment...'/>
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
        </Wrapper>
    )
}