import Image from "next/image";

const peopleLiked = [
  "/images/react_img1.png",
  "/images/react_img2.png",
  "/images/react_img3.png",
  "/images/react_img4.png",
  "/images/react_img5.png",
];

export default function PostAnalytics({
  likeCount,
  commentCount,
  shareCount,
}: {
  likeCount: number;
  commentCount: number;
  shareCount: number;
}) {
  const visibleLikes = Math.min(likeCount, peopleLiked.length);
  const likedMore = Math.max(0, likeCount - peopleLiked.length);

  return (
    <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
      <div className="_feed_inner_timeline_total_reacts_image">
        {peopleLiked.slice(0, visibleLikes).map((src, index) => (
          <div
            key={index}
            className="_react_avatar"
            style={{
              left: `${index * 18}px`,
              zIndex: index + 1,
            }}
          >
            <Image src={src} alt="" width={32} height={32} />
          </div>
        ))}

        {likedMore > 0 && (
          <div
            className="_react_more"
            style={{
              left: `${visibleLikes * 18}px`,
              zIndex: likeCount + 1,
            }}
          >
            {likedMore}
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts_txt">
        <p className="_feed_inner_timeline_total_reacts_para1">
          <a href="#0">
            <span>{commentCount}</span> Comment
          </a>
        </p>

        <p className="_feed_inner_timeline_total_reacts_para2">
          <span>{shareCount}</span> Share
        </p>
      </div>
    </div>
  );
}
