"use client";

import { registerUser } from "@/services/user";
import { registerSchema } from "@/services/validation/register";
import { RegisteredUserResponse } from "@/types/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

export default function RegistrationForm() {
  const router = useRouter();

  const [formState, setFormState] = useState<z.infer<typeof registerSchema>>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled = !agreementChecked || loading;

  const handleInputChange = (
    propName: keyof typeof formState,
    value: string,
  ) => {
    const newFormState = { ...formState, [propName]: value };
    setFormState(newFormState);

    if (!isSubmitted) return;

    const validationResult = registerSchema.safeParse(newFormState);
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
        if (propName === "password" || propName === "repeatPassword") {
          const repeatIssue = validationResult.error.issues.find(
            (i) => i.path[0] === "repeatPassword",
          );
          if (repeatIssue) {
            nextErrors.repeatPassword = repeatIssue.message;
          } else {
            delete nextErrors.repeatPassword;
          }
        }
      } else {
        return {};
      }
      return nextErrors;
    });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsSubmitted(true);
      const validationResult = registerSchema.safeParse(formState);
      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) formattedErrors[path.toString()] = issue.message;
        });
        setFormError(formattedErrors);
        return;
      }

      const result: RegisteredUserResponse = await registerUser(formState);
      console.log("result", result);
      if (result.success) {
        toast.success(result.message);
        router.push("/login");
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

  return (
    <>
      <p className="_social_registration_content_para _mar_b8">
        Get Started Now
      </p>
      <h4 className="_social_registration_content_title _titl4 _mar_b50">
        Registration
      </h4>
      <form className="_social_registration_form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="_social_registration_content_btn _mar_b40"
        >
          <Image
            src="/images/google.svg"
            alt="Image"
            className="_google_img"
            width={200}
            height={80}
          />{" "}
          <span>Register with google</span>
        </button>
        <div className="_social_registration_content_bottom_txt _mar_b40">
          {" "}
          <span>Or</span>
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                First Name
              </label>
              <input
                type="text"
                className={`form-control _social_registration_input ${formError.firstName ? "is-invalid" : ""}`}
                value={formState.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              {formError.firstName && (
                <div className="text-danger mt-1 small">
                  {formError.firstName}
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Last Name
              </label>
              <input
                type="text"
                className={`form-control _social_registration_input ${formError.lastName ? "is-invalid" : ""}`}
                value={formState.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              {formError.lastName && (
                <div className="text-danger mt-1 small">
                  {formError.lastName}
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Email
              </label>
              <input
                type="email"
                className={`form-control _social_registration_input ${formError.email ? "is-invalid" : ""}`}
                value={formState.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {formError.email && (
                <div className="text-danger mt-1 small">{formError.email}</div>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Password
              </label>
              <input
                type="password"
                className={`form-control _social_registration_input ${formError.password ? "is-invalid" : ""}`}
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
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Repeat Password
              </label>
              <input
                type="password"
                className={`form-control _social_registration_input ${formError.repeatPassword ? "is-invalid" : ""}`}
                value={formState.repeatPassword}
                onChange={(e) =>
                  handleInputChange("repeatPassword", e.target.value)
                }
              />
              {formError.repeatPassword && (
                <div className="text-danger mt-1 small">
                  {formError.repeatPassword}
                </div>
              )}
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
                checked={agreementChecked}
                onChange={(e) => {
                  console.log("radio handler fired", e.target.checked);
                  setAgreementChecked(e.target.checked);
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
                type="submit"
                className="_social_registration_form_btn_link _btn1"
                style={disabled ? { pointerEvents: "none" } : {}}
                disabled={disabled}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
