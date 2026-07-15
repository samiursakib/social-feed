import Feed from "@/components/Feed";
import LeftsideBar from "@/components/LeftsideBar";
import Navigation from "@/components/Navigation";
import RightsideBar from "@/components/RightsideBar";
import SwitchingButton from "@/components/SwitchingButton";
import { PostsProvider } from "@/context/PostsContext";
import { getPosts } from "@/services/post";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await getPosts();
  return (
    <PostsProvider initialPosts={data}>
      <div className="_layout _layout_main_wrapper">
        <SwitchingButton />
        <div className="_main_layout">
          <Navigation />
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                <LeftsideBar />
                <Feed />
                <RightsideBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PostsProvider>
  );
}
