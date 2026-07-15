"use client";

import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import { Reply } from "@/types/type";
import Image from "next/image";
import { LikeIcon } from "../Icons";
import RelativeTime from "../RelativeTime";

type ReplyItemProps = {
  postId: string;
  commentId: string;
  reply: Reply;
};

export default function ReplyItem({
  postId,
  commentId,
  reply,
}: ReplyItemProps) {
  const { user } = useAuth();

  const { likeReply, unlikeReply } = usePosts();

  const isLiked = !!user && reply.likes.some((l) => l.userId === user.id);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeReply(postId, commentId, reply.id);
      } else {
        await likeReply(postId, commentId, reply.id);
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
                {reply.user.firstName} {reply.user.lastName}
              </h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{reply.content}</span>
            </p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <LikeIcon />
              </span>
            </div>
            <span className="_total">{reply.likeCount}</span>
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
                  <span className="_time_link">
                    <RelativeTime datetime={reply.createdAt} isShortForm />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
