import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Wrapper from '../components/UI Kit/Wrapper'
import { FeedSkeleton } from '../components/UI Kit/Skeleton'
import FeedPost from '../components/FeedPost'
import Stories from '../components/Stories'
import Suggestions from '../components/Suggestions'
import styles from './Home.module.css'
import { addComment, getHomeFeed, toggleLikePost, toggleSavePost } from '../mock/api'
import Post from './Profile/Post'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

export default function Home(){
    const [showModal, setShowModal] = useState(false)
    const [postId, setPostId] = useState()

    const location = useLocation();

    const username = sessionStorage.getItem('username')

    const darkTheme = useTheme()
    const showToast = useToast()

    const queryClient = useQueryClient()
    const feedKey = ["home", username]

    const feedQuery = useInfiniteQuery({
        queryKey: feedKey,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => getHomeFeed(username, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPage,
      })

    const sentinelRef = useInfiniteScroll(feedQuery)

    const posts = feedQuery.data?.pages.flatMap(page => page.posts)

    // Applies a change to one post in the cached feed right away, and rolls back if the request fails
    const optimisticPostMutation = (mutationFn, applyChange) => ({
        mutationFn,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: feedKey })
            const previous = queryClient.getQueryData(feedKey)
            queryClient.setQueryData(feedKey, (data) => data && ({
                ...data,
                pages: data.pages.map(page => ({
                    ...page,
                    posts: page.posts.map(post => post.id === id ? applyChange(post) : post),
                })),
            }))
            return { previous }
        },
        onError: (_error, _id, context) => {
            queryClient.setQueryData(feedKey, context.previous)
            showToast('Something went wrong. Please try again.')
        },
        onSettled: (_data, _error, id) => {
            queryClient.invalidateQueries({ queryKey: feedKey })
            queryClient.invalidateQueries({ queryKey: ["posts", id], exact: true })
        },
    })

    const likeMutation = useMutation(optimisticPostMutation(
        (id) => toggleLikePost(id, username),
        (post) => ({
            ...post,
            likedByMe: !post.likedByMe,
            likesCount: post.likesCount + (post.likedByMe ? -1 : 1),
        })
    ))

    const saveMutation = useMutation({
        ...optimisticPostMutation(
            (id) => toggleSavePost(id, username),
            (post) => ({ ...post, savedByMe: !post.savedByMe })
        ),
        onSuccess: (_data, id) => {
            // The cache already holds the optimistic value, so this is the new state
            const isSaved = queryClient.getQueryData(feedKey)?.pages
                .flatMap(page => page.posts)
                .find(post => post.id === id)?.savedByMe
            showToast(isSaved ? 'Saved' : 'Removed from saved')
            queryClient.invalidateQueries({ queryKey: ["saved", username] })
        },
    })

    const commentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: feedKey }),
        onError: () => showToast('Could not post your comment.'),
    })

    const openPost = (id) => {
      setPostId(id)
      setShowModal(true)
    }

    const sharePost = async (post) => {
      const link = `${window.location.origin}/post/${post.id}`
      try {
        await navigator.clipboard.writeText(link)
        showToast('Link copied to clipboard')
      } catch {
        showToast('Could not copy the link')
      }
    }

    return(
        <Wrapper>
          <h1 className="sr-only">Home</h1>
          <div className={styles.layout}>
            <div className={styles.feed}>
              {feedQuery.isPending ? <FeedSkeleton /> : (
                <>
                  <Stories username={username} darkTheme={darkTheme} />

                  {feedQuery.isError ?
                  <div className={styles.status}>
                    <h2>Couldn't load your feed</h2>
                    <button onClick={() => feedQuery.refetch()}>Try again</button>
                  </div>
                  : posts.length === 0 ?
                  <div className={styles.status}>
                    <h2>Nothing to see yet</h2>
                    <p>Follow some people or visit the <Link to={'/explore'}>Explore tab</Link> to find posts.</p>
                  </div>
                  : posts.map((post, index) => (
                    <FeedPost
                      key={post.id}
                      post={post}
                      first={index === 0}
                      darkTheme={darkTheme}
                      onLike={() => likeMutation.mutate(post.id)}
                      onSave={() => saveMutation.mutate(post.id)}
                      onOpen={() => openPost(post.id)}
                      onShare={() => sharePost(post)}
                      onComment={(comment) => commentMutation.mutate({ comment, username, id: post.id })}
                    />
                  ))}

                  {feedQuery.hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}
                  {feedQuery.isFetchingNextPage && <p className={styles.more}>Loading more...</p>}
                  {feedQuery.isFetchNextPageError && (
                    <button className={styles.retry} onClick={() => feedQuery.fetchNextPage()}>Couldn't load more. Try again</button>
                  )}
                  {!feedQuery.hasNextPage && posts?.length > 0 && <p className={styles.more}>You're all caught up</p>}
                </>
              )}
            </div>

            <Suggestions username={username} />
          </div>

          {showModal &&
            <Post
              onClose={() => setShowModal(false)}
              showModal={showModal}
              realRoute={location.pathname}
              pseudoRoute={`/post/${postId}`}
            />
          }
        </Wrapper>
    )
}
