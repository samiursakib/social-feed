import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";

export default function RegistrationPage() {
  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <Image
          src="/images/shape1.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={80}
        />
        <Image
          src="/images/dark_shape.svg"
          alt=""
          className="_dark_shape"
          width={200}
          height={80}
        />
      </div>
      <div className="_shape_two">
        <Image
          src="/images/shape2.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={80}
        />
        <Image
          src="/images/dark_shape1.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={200}
          height={80}
        />
      </div>
      <div className="_shape_three">
        <Image
          src="/images/shape3.svg"
          alt=""
          className="_shape_img"
          width={200}
          height={80}
        />
        <Image
          src="/images/dark_shape2.svg"
          alt=""
          className="_dark_shape _dark_shape_opacity"
          width={200}
          height={80}
        />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <Image
                    src="/images/registration.png"
                    alt="Image"
                    width={200}
                    height={80}
                  />
                </div>
                <div className="_social_registration_right_image_dark">
                  <Image
                    src="/images/registration1.png"
                    alt="Image"
                    width={200}
                    height={80}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <Image
                    src="/images/logo.svg"
                    alt="Image"
                    className="_right_logo"
                    width={200}
                    height={80}
                  />
                </div>
                <RegistrationForm />
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <a href="/login">Login now</a>
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
  );
}
