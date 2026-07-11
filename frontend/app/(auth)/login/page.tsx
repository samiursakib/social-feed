import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <>
      <section className="_social_login_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <Image
            src="/images/shape1.svg"
            alt=""
            className="_shape_img"
            width={100}
            height={100}
          />
          <Image
            src="/images/dark_shape.svg"
            alt=""
            className="_dark_shape"
            width={100}
            height={100}
          />
        </div>
        <div className="_shape_two">
          <Image
            src="/images/shape2.svg"
            alt=""
            className="_shape_img"
            width={100}
            height={100}
          />
          <Image
            src="/images/dark_shape1.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
            width={100}
            height={100}
          />
        </div>
        <div className="_shape_three">
          <Image
            src="/images/shape3.svg"
            alt=""
            className="_shape_img"
            width={100}
            height={100}
          />
          <Image
            src="/images/dark_shape2.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
            width={100}
            height={100}
          />
        </div>
        <div className="_social_login_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_login_left">
                  <div className="_social_login_left_image">
                    <Image
                      src="/images/login.png"
                      alt="Image"
                      className="_left_img"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_login_content">
                  <div className="_social_login_left_logo _mar_b28">
                    <Image
                      src="/images/logo.svg"
                      alt="Image"
                      className="_left_logo"
                      width={100}
                      height={100}
                    />
                  </div>
                  <p className="_social_login_content_para _mar_b8">
                    Welcome back
                  </p>
                  <h4 className="_social_login_content_title _titl4 _mar_b50">
                    Login to your account
                  </h4>
                  <button
                    type="button"
                    className="_social_login_content_btn _mar_b40"
                  >
                    <Image
                      src="/images/google.svg"
                      alt="Image"
                      className="_google_img"
                      width={100}
                      height={100}
                    />{" "}
                    <span>Or sign-in with google</span>
                  </button>
                  <div className="_social_login_content_bottom_txt _mar_b40">
                    {" "}
                    <span>Or</span>
                  </div>
                  <LoginForm />
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">
                          Dont have an account?{" "}
                          <a href="#0">Create New Account</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
