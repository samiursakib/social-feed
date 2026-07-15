"use client";

import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import { Comment } from "@/types/type";
import Image from "next/image";
import { useState } from "react";
import { LikeIcon } from "../Icons";
import RelativeTime from "../RelativeTime";
import ReplyInput from "./ReplyInput";
import ReplyItem from "./ReplyItem";

type CommentItemProps = {
  postId: string;
  comment: Comment;
};

export default function CommentItem({ postId, comment }: CommentItemProps) {
  const { user } = useAuth();
  const { likeComment, unlikeComment } = usePosts();

  const [showReplyInput, setShowReplyInput] = useState(false);

  const isLiked =
    !!user && comment.likes.some((like) => like.userId === user.id);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeComment(postId, comment.id);
      } else {
        await likeComment(postId, comment.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <Image
          src="/images/txt_img.png"
          alt=""
          className="_comment_img1"
          width={200}
          height={80}
        />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">
                {comment.user.firstName} {comment.user.lastName}
              </h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <LikeIcon />
              </span>
            </div>
            <span className="_total">{comment.likeCount}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <button type="button" onClick={handleLike}>
                    {isLiked ? "Unlike" : "Like"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowReplyInput((prev) => !prev)}
                  >
                    Reply
                  </button>
                </li>
                <li>
                  <span className="_time_link">
                    <RelativeTime datetime={comment.createdAt} isShortForm />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {showReplyInput && (
          <ReplyInput postId={postId} commentId={comment.id} />
        )}
        {comment.replies.length > 0 && (
          <div className="_comment_replies">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                postId={postId}
                commentId={comment.id}
                reply={reply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
