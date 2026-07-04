import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/authSlice";
import Navbar from "@/components/navbar";
import CreatePost from "@/components/post/createPost";
import PostCard from "@/components/post/postCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPostsApi } from "@/api/postApi";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts", page],
        queryFn: () => getPostsApi(page),
        placeholderData: keepPreviousData,
    });

    if (!user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    const posts = data?.posts ?? [];
    const totalPages = data?.totalPages ?? 1;

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

                {totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className={
                                        page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        isActive={p === page}
                                        onClick={() => setPage(p)}
                                        className="cursor-pointer"
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    className={
                                        page >= totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </main>
        </div>
    );
}
