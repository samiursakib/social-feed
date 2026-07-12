import { Post } from "@/types/type";
import Image from "next/image";
import { ImageIcon, LikeIcon, RecorderIcon } from "./Icons";
import PostActionButtons from "./PostActionButtons";
import PostAnalytics from "./PostAnalytics";
import RelativeTime from "./RelativeTime";
import TimelineDropdownButton from "./TimelineDropdownButton";
import TimelineDropdownItems from "./TimelineDropdownItems";

export default function FeedPost({ post }: { post: Post }) {
  console.log("post", post);
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
                <a href="#0">Public</a>
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
      <PostAnalytics />
      <PostActionButtons />
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form">
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <Image
                  src="/images/comment_img.png"
                  alt=""
                  className="_comment_img"
                  width={200}
                  height={80}
                />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  id="floatingTextarea2"
                ></textarea>
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button className="_feed_inner_comment_box_icon_btn">
                <RecorderIcon />
              </button>
              <button className="_feed_inner_comment_box_icon_btn">
                <ImageIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="_timline_comment_main">
        <div className="_previous_comment">
          <button type="button" className="_previous_comment_txt">
            View 4 previous comments
          </button>
        </div>
        <div className="_comment_main">
          <div className="_comment_image">
            <a href="profile.html" className="_comment_image_link">
              <Image
                src="/images/txt_img.png"
                alt=""
                className="_comment_img1"
                width={200}
                height={80}
              />
            </a>
          </div>
          <div className="_comment_area">
            <div className="_comment_details">
              <div className="_comment_details_top">
                <div className="_comment_name">
                  <a href="profile.html ">
                    <h4 className="_comment_name_title">Radovan SkillArena</h4>
                  </a>
                </div>
              </div>
              <div className="_comment_status">
                <p className="_comment_status_text">
                  <span>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.{" "}
                  </span>
                </p>
              </div>
              <div className="_total_reactions">
                <div className="_total_react">
                  <span className="_reaction_like">
                    <LikeIcon />
                  </span>
                  {/* <span className="_reaction_heart">
                    <HeartIcon />
                  </span> */}
                </div>
                <span className="_total">198</span>
              </div>
              <div className="_comment_reply">
                <div className="_comment_reply_num">
                  <ul className="_comment_reply_list">
                    <li>
                      <span>Like.</span>
                    </li>
                    <li>
                      <span>Reply.</span>
                    </li>
                    <li>
                      <span>Share</span>
                    </li>
                    <li>
                      <span className="_time_link">.21m</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="_feed_inner_comment_box">
              <form className="_feed_inner_comment_box_form">
                <div className="_feed_inner_comment_box_content">
                  <div className="_feed_inner_comment_box_content_image">
                    <Image
                      src="/images/comment_img.png"
                      alt=""
                      className="_comment_img"
                      width={200}
                      height={80}
                    />
                  </div>
                  <div className="_feed_inner_comment_box_content_txt">
                    <textarea
                      className="form-control _comment_textarea"
                      placeholder="Write a comment"
                      id="floatingTextarea2"
                    ></textarea>
                  </div>
                </div>
                <div className="_feed_inner_comment_box_icon">
                  <button className="_feed_inner_comment_box_icon_btn">
                    <RecorderIcon />
                  </button>
                  <button className="_feed_inner_comment_box_icon_btn">
                    <ImageIcon />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
