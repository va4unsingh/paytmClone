import { useForm } from "react-hook-form";
import axios from "axios";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    console.log("Submitting the form", data);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signIn",
        data
      );
      localStorage.setItem("token", response.data.token);

      console.log("SignIn successful", response.data);
    } catch (error) {
      console.error("Error signing up", error);
    }
  }

  return (
    <form
      className="min-h-screen flex flex-col items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="bg-gray-50 px-8 md:px-20 py-12 md:py-16 shadow-sm rounded-2xl w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="bg-gray-600 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!errors.username}
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Min length at least 3" },
                maxLength: { value: 20, message: "Max length at most 20" },
              })}
            />
            {errors.username && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="bg-gray-600 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min length is 8" },
              })}
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2"
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
