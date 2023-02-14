import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import Wrapper from "../components/UI Kit/Wrapper"
import styles from './Explore.module.css'
import Post from "./Profile/Post"

export default function Explore(){

    const [modalIsVisible, setModalIsVisible] = useState()

    function getAllPosts(page) {
        return axios
        .get("/explore", {
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
        queryKey: ["posts", "infinite"],
        getNextPageParam: prevData => prevData.nextPage,
        queryFn: ({ pageParam = 1}) => getAllPosts(pageParam)
    })

    if (status === "loading") return <h1>Loading...</h1>
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>

    return(
        <Wrapper>
            <div className={styles.cards}>
                {data.pages
                .flatMap(data => data.posts)
                .map(post => (
                    <Link  key={post.id} onClick={() => {
                            setModalIsVisible(true)
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
                {modalIsVisible && <Post onClose={() => setModalIsVisible(false)}/>}
                {/* {hasNextPage && (
                    <button onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </button>
                )} */}
            </div>
        </Wrapper>
    )
}