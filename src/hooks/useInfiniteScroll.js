import { useCallback, useRef } from 'react'

// Returns a ref callback for a sentinel element; when it scrolls into view the next page loads
export default function useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }) {
    const observer = useRef()

    return useCallback((node) => {
        observer.current?.disconnect()
        if (!node || !hasNextPage || isFetchingNextPage) return

        observer.current = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchNextPage() },
            { rootMargin: '300px' }
        )
        observer.current.observe(node)
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])
}
