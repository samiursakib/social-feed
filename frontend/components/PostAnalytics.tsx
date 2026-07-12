import Image from "next/image";

export default function PostAnalytics() {
  return (
    <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
      <div className="_feed_inner_timeline_total_reacts_image">
        <Image
          src="/images/react_img1.png"
          alt="Image"
          className="_react_img1"
          width={200}
          height={80}
        />
        <Image
          src="/images/react_img2.png"
          alt="Image"
          className="_react_img"
          width={200}
          height={80}
        />
        <Image
          src="/images/react_img3.png"
          alt="Image"
          className="_react_img _rect_img_mbl_none"
          width={200}
          height={80}
        />
        <Image
          src="/images/react_img4.png"
          alt="Image"
          className="_react_img _rect_img_mbl_none"
          width={200}
          height={80}
        />
        <Image
          src="/images/react_img5.png"
          alt="Image"
          className="_react_img _rect_img_mbl_none"
          width={200}
          height={80}
        />
        <p className="_feed_inner_timeline_total_reacts_para">9+</p>
      </div>
      <div className="_feed_inner_timeline_total_reacts_txt">
        <p className="_feed_inner_timeline_total_reacts_para1">
          <a href="#0">
            <span>12</span> Comment
          </a>
        </p>
        <p className="_feed_inner_timeline_total_reacts_para2">
          <span>122</span> Share
        </p>
      </div>
    </div>
  );
}
