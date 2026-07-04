import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/authSlice";
import Navbar from "@/components/navbar";
import CreatePost from "@/components/post/createPost";
import PostCard from "@/components/post/postCard";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "@/api/postApi";

export default function Home() {
    const user = useSelector(selectCurrentUser);
    const { data: posts = [], isLoading, isError } = useQuery({
        queryKey: ["posts"],
        queryFn: getPostsApi
    })

    if (!user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />
            <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-6">
                <CreatePost />

                {isLoading && (
                    <p className="py-8 text-sm text-muted-foreground">Loading posts...</p>
                )}
                {isError && (
                    <p className="py-8 text-sm text-destructive">Failed to load posts.</p>
                )}
                {!isLoading && !isError && posts.length === 0 && (
                    <p className="py-8 text-sm text-muted-foreground">No posts yet. Be the first!</p>
                )}

                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </main>
        </div>
    );
}
