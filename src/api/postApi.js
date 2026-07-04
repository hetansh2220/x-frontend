import api from './axios'

export const createPostApi = async (FormData) => {
    const res = await api.post('/posts/createpost', FormData)
    return res.data
}


export const getPostsApi = async (FormData) => {
    const res = await api.get('/posts/getPosts', FormData)
    return res.data
}
