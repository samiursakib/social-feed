"use client";

import { usePosts } from "@/context/PostsContext";
import { Post } from "@/types/type";
import FeedPost from "./FeedPost";
import Stories from "./Stories";
import UploadPost from "./UploadPost";

export default function Feed() {
  const { posts } = usePosts();
  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">
          <Stories />
          <UploadPost />
          {posts.map((post: Post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
