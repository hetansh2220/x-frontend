import api from './axios'

export const createPostApi = async (FormData) => {
    const res = await api.post('/posts/createpost', FormData)
    return res.data
}


export const getPostsApi = async (page = 1, limit = 10) => {
    const res = await api.get('/posts/getPosts', { params: { page, limit } })
    return res.data
}

export const toggleLikeApi = async (postId) => {
    const res = await api.post(`/posts/togglelike/${postId}`)
    return res.data
}
