import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const res = await login(data);

      const token = res?.token || res?.accessToken || res?.jwt || "";
      if (!token) {
        setServerError("No token received from server");
        return;
      }

      setToken(token);
      navigate("/app", { replace: true });
    } catch (err) {
      setServerError(err?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="title">login</h2>
      <p className="helper">use your email + password</p>

      {serverError ? <div className="errorBox">{serverError}</div> : null}

      <input
        type="email"
        placeholder="email"
        className="input"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email",
          },
        })}
      />
      {errors.email ? <div className="errorText">{errors.email.message}</div> : null}

      <input
        type="password"
        placeholder="password"
        className="input"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 characters" },
        })}
      />
      {errors.password ? <div className="errorText">{errors.password.message}</div> : null}

      <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "logging in..." : "login"}
      </button>

      <a className="btn btnSecondary" href="/auth/signup">
        create account
      </a>
    </form>
  );
}
