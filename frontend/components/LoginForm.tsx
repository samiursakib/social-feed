"use client";

import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@/services/validation/login";
import { LoggedInUserResponse } from "@/types/type";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

export default function LoginForm() {
  const [formState, setFormState] = useState<z.infer<typeof loginSchema>>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleInputChange = (
    propName: keyof typeof formState,
    value: string,
  ) => {
    const newFormState = { ...formState, [propName]: value };
    setFormState(newFormState);

    if (!isSubmitted) return;

    const validationResult = loginSchema.safeParse(newFormState);
    setFormError((prev) => {
      const nextErrors = { ...prev };
      if (!validationResult.success) {
        const fieldIssue = validationResult.error.issues.find(
          (issue) => issue.path[0] === propName,
        );
        if (fieldIssue) {
          nextErrors[propName] = fieldIssue.message;
        } else {
          delete nextErrors[propName];
        }
      } else {
        return {};
      }
      return nextErrors;
    });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitted(true);
    const validationResult = loginSchema.safeParse(formState);
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) formattedErrors[path.toString()] = issue.message;
      });
      setFormError(formattedErrors);
      return;
    }

    try {
      const msg = await login(formState);
      toast.success(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="_social_login_content_para _mar_b8">Welcome back</p>
      <h4 className="_social_login_content_title _titl4 _mar_b50">
        Login to your account
      </h4>
      <button type="button" className="_social_login_content_btn _mar_b40">
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
      <form className="_social_login_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8">Email</label>
              <input
                type="text"
                className={`form-control _social_login_input ${formError.email ? "is-invalid" : ""}`}
                value={formState.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {formError.email && (
                <div className="text-danger mt-1 small">{formError.email}</div>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8">Password</label>
              <input
                type="password"
                className={`form-control _social_login_input ${formError.password ? "is-invalid" : ""}`}
                value={formState.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              {formError.password && (
                <div className="text-danger mt-1 small">
                  {formError.password}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="form-check _social_login_form_check">
              <input
                className="form-check-input _social_login_form_check_input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                checked
                onChange={() => {}}
              />
              <label
                className="form-check-label _social_login_form_check_label"
                htmlFor="flexRadioDefault2"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="_social_login_form_left">
              <p className="_social_login_form_left_para">Forgot password?</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <div className="_social_login_form_btn _mar_t40 _mar_b60">
              <button
                type="submit"
                className="_social_login_form_btn_link _btn1"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
