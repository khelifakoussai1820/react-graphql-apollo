import { useForm } from "react-hook-form";
import {useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

function LoginForm() {
    const navigate = useNavigate(); 
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        mode:"onBlur"
    });

    const onSubmit = async (data) => {
        try{
            const res = await login(data);
            localStorage.setItem("toker", res.token);
            navigate("/app");
        }catch (err) {
            console.err(err.message);
        }
        
    }


    return (<>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-10 space-y-4"> 
            <h2 className="text-2xl font-bold text-center">Login</h2>

            <input 
                type="email" 
                {...register("email", {
                    required: "Email is required", 
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid Email"
                    }
                })}
                placeholder="Enter your Email"
                className="borderp-2 w-full rounded"
            />

            {
                errors.email && (
                    <p className="text-red-700"> 
                        {errors.email.message} 
                    </p>
                )
            }

            <input 
                type="password" 
                {...register("password",{
                    required : 'Password is required'
                } )}

                placeholder="Enter your Password"
                className="border p-2 w-full rounded"
            />

            {errors.password && (
                <p className="text-red-600 text-sm">
                    {errors.password.message}
                </p>
            )}


            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white w-full py-2 rounded"
            >

                {
                    isSubmitting ? "Logging in..." : "Login"
                }

            </button>
        </form>    
    </>)

}


export default LoginForm;