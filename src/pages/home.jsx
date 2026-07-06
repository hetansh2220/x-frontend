import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/authSlice";
import Navbar from "@/components/navbar";
import CreatePost from "@/components/post/createPost";
import PostCard from "@/components/post/postCard";
import { getPostsApi } from "@/api/postApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
    const user = useSelector(selectCurrentUser);
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam = 1 }) => getPostsApi(pageParam),
        initialPageParam: 1,
        getNextPageParam: (
            { currentPage, totalPages }
        ) => {
            console.log(currentPage, totalPages)
            return currentPage < totalPages
                ? currentPage + 1
                : undefined;
        },
    });

    if (!user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    const posts = data?.pages.flatMap((page) => page.posts) ?? [];

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

                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchNextPage}
                    hasMore={!!hasNextPage}
                    loader={
                        <p className="py-4 text-center text-muted-foreground">
                            Loading more posts...
                        </p>
                    }
                    endMessage={
                        <p className="py-4 text-center text-muted-foreground">
                            You have seen everything.
                        </p>
                    }
                >
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </InfiniteScroll>


            </main>
        </div>
    );
}