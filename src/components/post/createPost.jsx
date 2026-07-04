import { selectCurrentUser } from '@/redux/authSlice'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Card, CardContent, CardFooter } from '../ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createPostApi } from '@/api/postApi'
import { useState } from "react"
import { Send } from 'lucide-react'

const MAX_LENGTH = 280

function CreatePost() {
    const user = useSelector(selectCurrentUser)
    const queryClient = useQueryClient()
    const [serverError, setServerError] = useState("")

    const { register, handleSubmit, reset, watch } = useForm()
    const content = watch("content") || ""

    const createPostMutation = useMutation({
        mutationFn: createPostApi,
        onSuccess: () => {
            reset()
            setServerError("")
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error) => {
            setServerError(error.response?.data?.msg || "Something went wrong")
        }
    })

    const onSubmit = (formData) => {
        if (!formData.content?.trim()) return
        createPostMutation.mutate(formData)
    }

    if (!user) return null

    const isEmpty = !content.trim()

    return (
        <Card className="w-full max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="flex gap-3">
                    <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                            {user.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            id="textarea-message"
                            placeholder="What's on your mind?"
                            maxLength={MAX_LENGTH}
                            className="min-h-20 resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
                            {...register("content")}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(onSubmit)()
                                }
                            }}
                        />
                        {serverError && (
                            <p className="text-sm text-destructive">{serverError}</p>
                        )}
                    </div>
                </CardContent>

                <Separator />

                <CardFooter className="justify-between border-t-0 bg-transparent">
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {content.length}/{MAX_LENGTH}
                    </span>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={createPostMutation.isPending || isEmpty}
                    >
                        <Send className="size-4" />
                        {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default CreatePost
