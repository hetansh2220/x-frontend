import axios from "axios";
import store from "@/redux/store";
import { setCredentials, logout } from "@/redux/authSlice";
import { refreshApi } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
    timeout: 5000,
});


api.interceptors.request.use((config) => {
    try {
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
    catch (err) {
        console.log("err:", err)
    }
});

api.interceptors.response.use((res) => res,

    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const data = await refreshApi()
                console.log(data, 'sds')
                store.dispatch(
                    setCredentials({
                        user: store.getState().auth.user,
                        accessToken: data.accessToken,
                    })
                )
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            }
            catch (err) {
                store.dispatch(logout());
                window.location.href = "/login";

                return Promise.reject(err);
            }
        }
        return Promise.reject(error);

    }
)

export default api;