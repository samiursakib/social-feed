"use client";

export default function RegistrationForm() {
  return (
    <form className="_social_registration_form">
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Email</label>
            <input
              type="email"
              className="form-control _social_registration_input"
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">
              Password
            </label>
            <input
              type="password"
              className="form-control _social_registration_input"
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">
              Repeat Password
            </label>
            <input
              type="password"
              className="form-control _social_registration_input"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="form-check _social_registration_form_check">
            <input
              className="form-check-input _social_registration_form_check_input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              checked
              onChange={() => {
                console.log("radio handler fired");
              }}
            />
            <label
              className="form-check-label _social_registration_form_check_label"
              htmlFor="flexRadioDefault2"
            >
              I agree to terms & conditions
            </label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_registration_form_btn _mar_t40 _mar_b60">
            <button
              type="button"
              className="_social_registration_form_btn_link _btn1"
            >
              Login now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
