import { useNavigate, useParams } from 'react-router-dom'
import Home from './Home'
import Post from './Profile/Post'

// Direct link to a single post (/post/:id): the post opens over the feed
export default function PostPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <>
            <Home />
            <Post pseudoRoute={`/post/${id}`} onClose={() => navigate('/')} />
        </>
    )
}
