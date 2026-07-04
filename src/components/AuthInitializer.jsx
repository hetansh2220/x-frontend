import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getMeApi } from '@/api/authApi'
import { setCredentials } from "@/redux/authSlice";


export default function AuthInitializer({ children }) {
    const dispatch = useDispatch()
    const { isLoading, isError } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const data = await getMeApi();
            dispatch(
                setCredentials({
                    user: data.user,
                    accessToken: data.accessToken,
                })
            );
            return data
        },
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return children;
}