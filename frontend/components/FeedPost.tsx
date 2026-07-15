import { Post } from "@/types/type";
import Image from "next/image";
import CommentsSection from "./comments/CommentsSection";
import PostActionButtons from "./PostActionButtons";
import PostAnalytics from "./PostAnalytics";
import RelativeTime from "./RelativeTime";
import TimelineDropdownButton from "./TimelineDropdownButton";
import TimelineDropdownItems from "./TimelineDropdownItems";

export default function FeedPost({ post }: { post: Post }) {
  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Image
                src="/images/post_img.png"
                alt=""
                className="_post_img"
                width={200}
                height={80}
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.user.firstName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                <RelativeTime datetime={post.createdAt} /> .
                <a href="#0">{post.visibility}</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <TimelineDropdownButton />
            </div>
            {/*Dropdown*/}
            <TimelineDropdownItems />
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.imageUrl ? (
          <div className="_feed_inner_timeline_image">
            <Image
              src={post.imageUrl}
              alt=""
              className="_time_img"
              width={200}
              height={80}
            />
          </div>
        ) : null}
      </div>
      <PostAnalytics
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        shareCount={0}
      />
      <PostActionButtons post={post} />
      <CommentsSection post={post} />
    </div>
  );
}
