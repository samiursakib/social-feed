import Image from "next/image";
import {
  ArticleIcon,
  EditIcon,
  EventIcon,
  PhotoIcon,
  PostIcon,
  VideoIcon,
} from "./Icons";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { usePosts } from "@/context/PostsContext";
import { uploadPost } from "@/services/post";
import { UploadedPostResponse } from "@/types/type";

export default function UploadPost() {
  const { addPost } = usePosts();

  const [formState, setFormState] = useState<{
    text: string;
    image: File | null;
  }>({
    text: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    console.log(text);
    setFormState((prev) => ({ ...prev, text }));
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormState((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", formState.text);
      if (formState.image) formData.append("image", formState.image);

      const result: UploadedPostResponse = await uploadPost(formData);
      if (result.success) {
        toast.success(result.message);
        setFormState({ text: "", image: null });
        setPreview(null);
        addPost(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  console.log("loading", loading);

  return (
    <form onSubmit={handleSubmit}>
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image">
            <Image
              src="/images/txt_img.png"
              alt="Image"
              className="_txt_img"
              width={200}
              height={80}
            />
          </div>
          <div className="_feed_inner_text_area_box_form">
            {!formState.text && (
              <div className="_feed_textarea_placeholder">
                <span>Write something ...</span>
                <EditIcon />
              </div>
            )}
            <textarea
              className="form-control _textarea"
              value={formState.text}
              onChange={handleTextChange}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
          </div>
        </div>
        {preview ? (
          <Image
            src={preview}
            alt="preview"
            width={200}
            height={80}
            style={{ objectFit: "cover" }}
          />
        ) : null}
        {/*For Desktop*/}
        <div className="_feed_inner_text_area_bottom">
          <div className="_feed_inner_text_area_item">
            <div className="_feed_inner_text_area_bottom_photo _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
                onClick={handleImageUpload}
              >
                {" "}
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  {" "}
                  <PhotoIcon />
                </span>
                Photo
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_video _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                {" "}
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  {" "}
                  <VideoIcon />
                </span>
                Video
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_event _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                {" "}
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  {" "}
                  <EventIcon />
                </span>
                Event
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_article _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                {" "}
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  {" "}
                  <ArticleIcon />
                </span>
                Article
              </button>
            </div>
          </div>
          <PostButton loading={loading} />
        </div>
        {/*For Desktop*/}
        {/*For Mobile*/}
        <div className="_feed_inner_text_area_bottom_mobile">
          <div className="_feed_inner_text_mobile">
            <div className="_feed_inner_text_area_item">
              <div className="_feed_inner_text_area_bottom_photo _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                  onClick={handleImageUpload}
                >
                  {" "}
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    {" "}
                    <PhotoIcon />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_video _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <VideoIcon />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_event _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <EventIcon />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_article _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <ArticleIcon />
                  </span>
                </button>
              </div>
            </div>
            <PostButton loading={loading} />
          </div>
        </div>
        {/*For Mobile*/}
      </div>
    </form>
  );
}

function PostButton(
  { loading }: { loading: boolean } = {
    loading: false,
  },
) {
  return (
    <div className="_feed_inner_text_area_btn">
      <button
        type="submit"
        className="_feed_inner_text_area_btn_link"
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2">Posting...</span>
          </>
        ) : (
          <>
            <PostIcon />
            <span className="ms-2">Post</span>
          </>
        )}
      </button>
    </div>
  );
}
