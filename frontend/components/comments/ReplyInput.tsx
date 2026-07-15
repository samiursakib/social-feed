"use client";

import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import Image from "next/image";
import { FormEvent, KeyboardEvent, useState } from "react";
import { ImageIcon, RecorderIcon } from "../Icons";

type ReplyInputProps = {
  postId: string;
  commentId: string;
};

export default function ReplyInput({ postId, commentId }: ReplyInputProps) {
  const { createReply } = usePosts();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReply = async () => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    try {
      setLoading(true);
      await createReply(postId, commentId, trimmed);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitReply();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submitReply();
    }
  };

  return (
    <div className="_feed_inner_comment_box">
      <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <Image
              src="/images/comment_img.png"
              alt={`${user?.firstName ?? "User"} avatar`}
              className="_comment_img"
              width={200}
              height={80}
            />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              className="form-control _comment_textarea"
              placeholder="Write a reply..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <button type="button" className="_feed_inner_comment_box_icon_btn">
            <RecorderIcon />
          </button>
          <button type="button" className="_feed_inner_comment_box_icon_btn">
            <ImageIcon />
          </button>
          <button
            type="submit"
            className="_feed_inner_comment_box_icon_btn"
            disabled={loading || !content.trim()}
          >
            {loading ? "Posting..." : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
