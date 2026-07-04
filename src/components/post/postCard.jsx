import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
} from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { selectCurrentUser } from '@/redux/authSlice'
import { toggleLikeApi } from '@/api/postApi'

function PostCard({ post }) {
    const author = post?.author
    const user = useSelector(selectCurrentUser)

    const [liked, setLiked] = useState(
        () => post?.likes?.some((id) => id === user?.id) ?? false
    )
    const [likeCount, setLikeCount] = useState(() => post?.likes?.length ?? 0)

    const { mutate: toggleLike, isPending } = useMutation({
        mutationFn: () => toggleLikeApi(post?._id),
        onMutate: () => {
            setLiked((prev) => !prev)
            setLikeCount((prev) => prev + (liked ? -1 : 1))
        },
        onSuccess: (data) => {
            setLiked(data.liked)
            setLikeCount(data.LikedCount)
        },
        onError: () => {
            setLiked((prev) => !prev)
            setLikeCount((prev) => prev + (liked ? 1 : -1))
        },
    })

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader className="flex-row items-center gap-3">
                <Avatar>
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback>
                        {author.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{author.username}</CardTitle>
                    <CardDescription>@{author.username}</CardDescription>
                </div>
                <CardAction>
                    <Button variant="ghost" size="icon-sm" aria-label="More options">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {post?.content}
                </p>
            </CardContent>

            <CardFooter className="gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike()}
                    disabled={isPending}
                    aria-pressed={liked}
                    className={cn(
                        "text-muted-foreground",
                        liked && "text-red-500 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("size-4", liked && "fill-current")} />
                    {likeCount > 0 ? likeCount : "Like"}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="size-4" />
                    Comment
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="size-4" />
                    Share
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PostCard
