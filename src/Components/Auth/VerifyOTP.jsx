import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { verifyOTP } from "../../api/auth";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id") || "";
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      await verifyOTP(userId, data.otp);
      navigate("/auth/login", { replace: true });
    } catch (err) {
      setServerError(err?.message || "Verification failed");
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
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },
    title: { fontSize: "28px", fontWeight: "700", marginBottom: "8px" },
    helper: { fontSize: "14px", color: "#64748b", marginBottom: "20px" },
    input: {
      width: "80%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      textAlign: "center",
      letterSpacing: "4px",
    },
    btnPrimary: {
      width: "87%",
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
      width: "80%",
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

    <div  style={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <h2 style={styles.title}>Verify OTP</h2>
      <p style={styles.helper}>Check your email, then enter the 6 digits</p>

      {serverError && <div style={styles.errorBox}>{serverError}</div>}

      <input
        type="text"
        placeholder="000000"
        style={styles.input}
        {...register("otp", {
          required: "OTP is required",
          pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" },
        })}
      />
      {errors.otp && <div style={styles.errorText}>{errors.otp.message}</div>}

      <button style={styles.btnPrimary} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </button>

      <a style={styles.btnSecondary} href="/auth/login">Back to login</a>
    </form>
  
    </div>
  );  
}
