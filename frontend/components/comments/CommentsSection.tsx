"use client";

import { Post } from "@/types/type";
import { useMemo, useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

const INITIAL_VISIBLE_COMMENTS = 3;

export default function CommentsSection({ post }: { post: Post }) {
  const [showAllComments, setShowAllComments] = useState(false);

  const comments = useMemo(() => {
    return showAllComments
      ? post.comments
      : post.comments.slice(0, INITIAL_VISIBLE_COMMENTS);
  }, [post.comments, showAllComments]);

  const hasMoreComments = post.comments.length > INITIAL_VISIBLE_COMMENTS;

  return (
    <>
      <CommentInput postId={post.id} />
      <div className="_timline_comment_main">
        {!showAllComments && hasMoreComments && (
          <div className="_previous_comment">
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => setShowAllComments(true)}
            >
              View previous comments
            </button>
          </div>
        )}
        {comments.map((comment) => (
          <CommentItem key={comment.id} postId={post.id} comment={comment} />
        ))}
      </div>
    </>
  );
}
