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
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

function PostCard({ post }) {
    const author = post?.author

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
                    {post?.content }
                </p>
            </CardContent>

            <CardFooter className="gap-1">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="size-4" />
                    Like
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
