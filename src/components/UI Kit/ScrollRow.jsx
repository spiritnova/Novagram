import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './ScrollRow.module.css'

const DRAG_THRESHOLD = 5

// A horizontally scrolling row that shows arrow buttons (and soft edges) when there is more
// to see, and can be dragged with a mouse. Renders its own list element: as="ul" by default.
export default function ScrollRow({ as: List = 'ul', className = '', children, ...props }) {
    const scroller = useRef()
    const drag = useRef(null)
    const [edges, setEdges] = useState({ start: false, end: false })

    const update = useCallback(() => {
        const el = scroller.current
        if (!el) return
        const start = el.scrollLeft > 4
        const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
        // only re-render when something changed
        setEdges(prev => (prev.start === start && prev.end === end ? prev : { start, end }))
    }, [])

    // recheck when the row or its content changes size
    useEffect(() => {
        const el = scroller.current
        update()

        const observer = new ResizeObserver(update)
        observer.observe(el)
        Array.from(el.children).forEach(child => observer.observe(child))
        return () => observer.disconnect()
    }, [update, children])

    const scrollBy = (direction) => {
        const el = scroller.current
        el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: 'smooth' })
    }

    // dragging with a mouse (touch already scrolls natively)
    const pointerDown = (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return
        drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false }
    }

    const pointerMove = (e) => {
        if (!drag.current) return
        const distance = e.clientX - drag.current.x
        if (Math.abs(distance) > DRAG_THRESHOLD) drag.current.moved = true
        if (drag.current.moved) scroller.current.scrollLeft = drag.current.left - distance
    }

    const pointerUp = () => {
        // keep the flag until the click that follows a drag has been swallowed
        setTimeout(() => { drag.current = null }, 0)
    }

    const swallowDragClick = (e) => {
        if (drag.current?.moved) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const arrowKeys = (e) => {
        if (e.key === 'ArrowRight' && e.target === scroller.current) scrollBy(1)
        if (e.key === 'ArrowLeft' && e.target === scroller.current) scrollBy(-1)
    }

    return (
        <div className={styles.wrap}>
            {edges.start && (
                <button className={`${styles.arrow} ${styles.left}`} onClick={() => scrollBy(-1)} aria-label="Scroll left" tabIndex={-1}>
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>
            )}

            <List
                ref={scroller}
                className={`${styles.row} ${edges.start ? styles.fadeStart : ''} ${edges.end ? styles.fadeEnd : ''} ${className}`}
                onScroll={update}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerUp}
                onPointerLeave={pointerUp}
                onClickCapture={swallowDragClick}
                onKeyDown={arrowKeys}
                {...props}
            >
                {children}
            </List>

            {edges.end && (
                <button className={`${styles.arrow} ${styles.right}`} onClick={() => scrollBy(1)} aria-label="Scroll right" tabIndex={-1}>
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            )}
        </div>
    )
}
