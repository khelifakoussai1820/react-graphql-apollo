import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../api/auth";
import { useState } from "react";

function toBoolGender(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return true;
}

export default function SignUpForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const payload = { ...data, gender: toBoolGender(data.gender) };
      const res = await registerUser(payload);
      const id = res?.userId || res?.id || res?.user?.id || res?.userID;

      if (id) {
        navigate(`/auth/verify?id=${encodeURIComponent(id)}`, { replace: true });
        return;
      }
      navigate("/auth/login", { replace: true });

    } catch (err) {
      console.error(err);
      setServerError(err?.message || "Signup failed");
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
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.helper}>Then you can create workspaces + pages</p>

          {serverError && <div style={styles.errorBox}>{serverError}</div>}

          <input
            placeholder="Name"
            style={styles.input}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <div style={styles.errorText}>{errors.name.message}</div>}

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

        <select style={styles.input} {...register("gender", { required: "Gender is required" })}>
          <option value="">Gender</option>
          <option value="true">Male</option>
          <option value="false">Female</option>
        </select>
          {errors.gender && <div style={styles.errorText}>{errors.gender.message}</div>}

        <button style={styles.btnPrimary} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>

        <a style={styles.btnSecondary} href="/auth/login">
          Already have an account
        </a>
      </form>
    </div>

    
  );
}
