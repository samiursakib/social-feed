"use client";

import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostsContext";
import Image from "next/image";
import { FormEvent, KeyboardEvent, useState } from "react";
import { ImageIcon, RecorderIcon } from "../Icons";

type CommentInputProps = {
  postId: string;
};

export default function CommentInput({ postId }: CommentInputProps) {
  const { createComment } = usePosts();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    try {
      setLoading(true);
      await createComment(postId, trimmed);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitComment();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submitComment();
    }
  };

  return (
    <div className="_feed_inner_timeline_cooment_area">
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
                placeholder="Write a comment..."
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
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
