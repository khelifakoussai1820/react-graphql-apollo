import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../api/auth";

function toBoolGender(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return true;
}

export default function SignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        gender: toBoolGender(data.gender),
      };

      const res = await registerUser(payload);

      if (res?.otpEnabled) {
        const id = res?.userId || res?.id || res?.user?.id;
        navigate(`/auth/verify?id=${encodeURIComponent(id || "")}`);
        return;
      }

      navigate("/auth/login", { replace: true });
    } catch (err) {
    // you can show it in UI if you want
      console.error(err);
      alert(err?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="title">create account</h2>
      <p className="helper">then you can create workspaces + pages</p>

      <input
        className="input"
        placeholder="name"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name ? <div className="errorText">{errors.name.message}</div> : null}

      <input
        type="email"
        className="input"
        placeholder="email"
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
        className="input"
        placeholder="password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 characters" },
        })}
      />
      {errors.password ? <div className="errorText">{errors.password.message}</div> : null}

      <select className="input" {...register("gender", { required: "Gender is required" })}>
        <option value="">gender</option>
        <option value="true">male</option>
        <option value="false">female</option>
      </select>
      {errors.gender ? <div className="errorText">{errors.gender.message}</div> : null}

      <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "creating..." : "create"}
      </button>

      <a className="btn btnSecondary" href="/auth/login">
        already have an account
      </a>
    </form>
  );
}
