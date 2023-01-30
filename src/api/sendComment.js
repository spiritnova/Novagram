export default function createComment({ comment, id }){
    const post = {
        "comment": comment,
        "id": id
    }

    fetch("/comment", {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body: JSON.stringify(post)
    })
}