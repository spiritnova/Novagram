// Shrinks a picked image before it is stored. The demo keeps everything in the browser's
// localStorage (about 5 MB in total), so full-size photos would fill it after a couple of uploads.
export function resizeImage(file, maxSize = 1080, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(url)
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(image.width * scale)
            canvas.height = Math.round(image.height * scale)
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error('Could not process that image'))),
                'image/jpeg',
                quality
            )
        }

        image.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('That file is not a readable image'))
        }

        image.src = url
    })
}
