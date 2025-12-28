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


  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc, #5b6482)",
      fontFamily:
        "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },

    form: {
      maxWidth: "400px",
      padding: "32px",
      background: "#fff",
      borderRadius: "14px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      textAlign: "center",
      fontFamily:
        "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },

    title: { fontSize: "28px", fontWeight: "700", marginBottom: "8px" },
    helper: { fontSize: "14px", color: "#64748b", marginBottom: "20px" },
    
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
    },

    btnPrimary: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "#4f46e5",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "12px",
    },
    
    btnSecondary: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      background: "#fff",
      color: "#0f172a",
      fontWeight: "600",
      textDecoration: "none",
      display: "inline-block",
      cursor: "pointer",
    },
    
    errorText: {
      color: "#dc2626",
      fontSize: "13px",
      marginBottom: "8px",
      textAlign: "left",
    },
    
    errorBox: {
      background: "#fee2e2",
      color: "#b91c1c",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "12px",
      textAlign: "left",
    },
  };

  return (
      <div style={styles.page}>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <h2 style={styles.title}>Login</h2>
          <p  style={styles.helper}>Use your email + password</p>

          {serverError && <div style={styles.errorBox}>{serverError}</div>}

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
            {errors.email && <div style={styles.errorText}>{errors.email.message}</div>}

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />
          {errors.password && <div style={styles.errorText}>{errors.password.message}</div>}

          <button style={styles.btnPrimary} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <a style={styles.btnSecondary} href="/auth/signup">
            Create account
          </a>
        </form>
      </div>
  );
}
