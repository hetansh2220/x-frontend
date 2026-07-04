import api from "./axios";

export const registerApi = async (formData) => {
    const res = await api.post("/auth/register", formData);
    return res.data;
};

export const loginApi = async (formData) => {
    const res = await api.post("/auth/login", formData)
    return res.data;
}

export const logoutApi = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
}


export const getMeApi = async () => {
    const res = await api.get('/auth/me');
    return res.data
}

export const refreshApi = async () => {
    const res = await api.get('/auth/refresh')
    return res.data
}
