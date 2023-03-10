export default function createComment({ comment, user_id, id }){
    const post = {
        "comment": comment,
        "user_id": user_id,
        "id": id
    }

    let api = 'https://novagram-api.onrender.com'

    fetch(`${api}/comment`, {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body: JSON.stringify(post)
    })
}