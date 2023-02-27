import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import styles from './Explore.module.css'
import Post from "./Profile/Post"
import Loader from '../components/UI Kit/Loader'

export default function Explore(){

    const location = useLocation()
    const [modalIsVisible, setModalIsVisible] = useState()
    const [postId, setPostId] = useState()

    let api = 'https://novagram-api.onrender.com'

    function getAllPosts(page) {
        return axios
        .get(`${api}/explore`, {
            params : {_page: page}
        })
        .then(res => {
            const hasNext = page * 2 <= parseInt(res.data.length)
            return {
                nextPage: hasNext ? page + 1 : undefined,
                previousPage: page > 1 ? page - 1 : undefined,
                posts: res.data
            }
        })
    }

    const {status, error, data } = useInfiniteQuery({
        queryKey: ["posts"],
        getNextPageParam: prevData => prevData.nextPage,
        queryFn: ({ pageParam = 1}) => getAllPosts(pageParam)
    })

    if (status === "loading") return <div className={styles.loader}><Loader type={'2'}/></div>
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>

    return(
        <div className={styles.wrapper}>
            <div className={styles.cards}>
                {data.pages
                .flatMap(data => data.posts)
                .map(post => (
                    <Link key={post.id} onClick={() => {
                            setModalIsVisible(true)
                            setPostId(post.id)
                        }}>
                        <div className={styles.card}>
                            <img alt="posts" src={post.image}/>
                            <div className={styles.buttons}>
                                <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                            </div>
                        </div>
                    </Link>
                ))}

                {modalIsVisible && 
                <Post 
                    showModal={modalIsVisible}
                    realRoute={location.pathname} 
                    onClose={() => setModalIsVisible(false)}
                    pseudoRoute={`/post/${postId}`}
                    />}
                {/* {hasNextPage && (
                    <button onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </button>
                )} */}
            </div>
        </div>
    )
}