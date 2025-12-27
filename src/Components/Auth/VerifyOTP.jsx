import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOTP } from "../../api/auth";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      await verifyOTP(userId, data.otp);
      navigate("/auth/login", { replace: true });
    } catch (err) {
      alert(err?.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="title">verify otp</h2>
      <p className="helper">check your email, then enter the 6 digits</p>

      <input
        type="text"
        className="input"
        placeholder="000000"
        {...register("otp", {
          required: "OTP is required",
          pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" },
        })}
      />
      {errors.otp ? <div className="errorText">{errors.otp.message}</div> : null}

      <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "verifying..." : "verify"}
      </button>

      <a className="btn btnSecondary" href="/auth/login">back to login</a>
    </form>
  );
}
