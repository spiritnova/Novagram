import { Heart, MessageCircle } from "lucide-react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import styles from './Explore.module.css'
import Post from "./Profile/Post"
import { GridSkeleton } from '../components/UI Kit/Skeleton'
import { getExplorePosts, getTrendingTags } from "../mock/api"
import useInfiniteScroll from "../hooks/useInfiniteScroll"
import ScrollRow from "../components/UI Kit/ScrollRow"

export default function Explore(){

    const location = useLocation()
    const [searchParams] = useSearchParams()
    const tag = (searchParams.get('tag') ?? '').toLowerCase()

    const [modalIsVisible, setModalIsVisible] = useState()
    const [postId, setPostId] = useState()

    const trendingQuery = useQuery({
        queryKey: ["trending-tags"],
        queryFn: getTrendingTags,
    })

    async function getAllPosts(page) {
        const { posts, hasNext, total } = await getExplorePosts(page, tag)
        return {
            nextPage: hasNext ? page + 1 : undefined,
            posts,
            total,
        }
    }

    const query = useInfiniteQuery({
        queryKey: ["explore-posts", tag],
        initialPageParam: 1,
        getNextPageParam: prevData => prevData.nextPage,
        queryFn: ({ pageParam }) => getAllPosts(pageParam)
    })

    const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = query
    const sentinelRef = useInfiniteScroll(query)

    const trending = (
        <>
            {!tag && <h1 className="sr-only">Explore</h1>}
        <ScrollRow as="div" className={styles.tags} aria-label="Trending hashtags" role="group">
            {trendingQuery.data?.map(({ tag: name, count }) => (
                <Link
                    key={name}
                    to={name === tag ? '/explore' : `/explore?tag=${encodeURIComponent(name)}`}
                    className={`${styles.tag} ${name === tag ? styles.tagActive : ''}`}
                    aria-current={name === tag ? 'true' : undefined}
                >
                    #{name} <span>{count}</span>
                </Link>
            ))}
        </ScrollRow>
        </>
    )

    if (status === "pending") return (
        <div className={styles.wrapper}>
            {trending}
            <GridSkeleton columns={4} count={12} />
        </div>
    )
    if (status === "error") return (
        <div className={styles.status}>
            <h2>Couldn't load posts</h2>
            <button onClick={() => query.refetch()}>Try again</button>
        </div>
    )

    const posts = data.pages.flatMap(page => page.posts)

    return(
        <div className={styles.wrapper}>
            {trending}

            {tag && (
                <header className={styles.tagHeader}>
                    <h1>#{tag}</h1>
                    <span>{data.pages[0].total} post{data.pages[0].total === 1 ? '' : 's'}</span>
                    <Link to="/explore">Clear</Link>
                </header>
            )}

            {posts.length === 0 && (
                <p className={styles.footerText}>No posts tagged #{tag} yet.</p>
            )}

            <div className={styles.cards}>
                {posts.map((post, index) => (
                    <button
                        key={post.id}
                        className={`${styles.tile} ${!tag && index % 9 === 0 ? styles.featured : ''}`}
                        onClick={() => {
                            setModalIsVisible(true)
                            setPostId(post.id)
                        }}
                        aria-label={`Open post, ${post.likes} likes, ${post.comments} comments`}
                    >
                        <div className={styles.card}>
                            <img alt="" src={post.image} loading="lazy"/>
                            <div className={styles.buttons}>
                                <span><Heart size={20} fill="currentColor" aria-hidden="true" />{post.likes}</span>
                                <span><MessageCircle size={20} fill="currentColor" aria-hidden="true" />{post.comments}</span>
                            </div>
                        </div>
                    </button>
                ))}

                {modalIsVisible &&
                <Post
                    showModal={modalIsVisible}
                    realRoute={location.pathname + location.search}
                    onClose={() => setModalIsVisible(false)}
                    pseudoRoute={`/post/${postId}`}
                    />}
            </div>
            {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
            {isFetchingNextPage && <p className={styles.footerText}>Loading more...</p>}
            {isFetchNextPageError && (
                <div className={styles.loadMoreWrapper}>
                    <button className={styles.loadMore} onClick={() => fetchNextPage()}>Couldn't load more. Try again</button>
                </div>
            )}
        </div>
    )
}
