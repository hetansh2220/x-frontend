import React from 'react'
import { selectCurrentUser } from '@/redux/authSlice'
import { useSelector } from 'react-redux'

function landingPage() {
    const user = useSelector(selectCurrentUser)
    console.log(user)
    return (
        <div>
            <img src={user.avatar} alt={user.username} className="size-16 rounded-full" />
            <p>{user?.username}</p>
        </div>
    )
}

export default landingPage