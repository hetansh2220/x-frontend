import { Button } from './ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutApi } from '@/api/authApi'
import { logout } from '@/redux/authSlice'
import { selectIsAuthenticated, selectCurrentUser } from '@/redux/authSlice'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Sparkles, LogOut } from 'lucide-react'

function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const user = useSelector(selectCurrentUser)

    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            dispatch(logout())
            queryClient.removeQueries({ queryKey: ["auth", "me"] })
            navigate('/login')
        },
        onError: (error) => {
            console.log("LOGOUT ERROR:", error.response?.data || error.message)
        }
    })

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
            <nav className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-base font-semibold tracking-tight">Anonymity</span>
                </Link>

                <div className="flex items-center gap-2">
                    {!isAuthenticated ? (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/signup">Register</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className="size-4" />
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </Button>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>
                                    {user?.username?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
