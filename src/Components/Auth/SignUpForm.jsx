import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../../api/auth";

function SignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);

      if (res.otpEnabled) {
        navigate(`/auth/verify?id=${res.userId}`);
      } else {
        navigate("/auth/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 space-y-3"
    >
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Enter your name"
        className="border p-2 w-full rounded"
      />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}

      <input
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email invalid",
          },
        })}
        placeholder="Enter your email"
        className="border p-2 w-full rounded"
      />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
        })}
        placeholder="Enter your password"
        className="border p-2 w-full rounded"
      />
      {errors.password && (
        <p className="text-red-600">{errors.password.message}</p>
      )}

      <select
        {...register("gender", { required: "Gender is required" })}
        className="border p-2 w-full rounded"
      >
        <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
      {errors.gender && (
        <p className="text-red-600">{errors.gender.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white w-full py-2 rounded"
      >
        {isSubmitting ? "Creating account..." : "Create your account"}
      </button>
    </form>
  );
}

export default SignUpForm;
