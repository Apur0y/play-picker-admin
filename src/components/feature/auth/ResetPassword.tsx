/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { useResetPasswordMutation } from "../../../redux/api/auth/authApi";
import CustomInput from "../../../ui/CustomeInput";
import { useQuery } from "../../../utils/searchParams";
import PrimaryButton from "../../shared/primaryButton/PrimaryButton";
import Logo from "../../shared/Logo";
import Container from "../../../lib/Container";

// Define Zod schema for validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useNavigate();
  const searchParams = useQuery();
  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";

  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPassword({
        userId,
        password: data.password,
        token,
      }).unwrap();

      if (response?.success) {
    
        toast.success("Password reset successfully");
        router("/");
      } else {
        console.error("Failed to reset password");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <Container className="w-full lg:min-w-[500px]">
      <div className="flex flex-col items-center mb-8">
        <Logo />
        <h1 className="text-2xl font-bold mb-2">Change New Password!!</h1>
        <p className="text-gray-500 text-sm text-center">
          Welcome to Website Name <br />
          Enter a different password with the previous!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Password Input */}
        <CustomInput
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••••"
          showPasswordToggle={true}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password Input */}
        <CustomInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••••"
          showPasswordToggle={true}
          error={
            typeof errors.confirmPassword?.message === "string"
              ? errors.confirmPassword.message
              : "Password confirmation does not match the password."
          }
          {...register("confirmPassword")}
        />

        {/* Sign Up Button */}
        <PrimaryButton type="submit" loading={isLoading}>
          Reset
        </PrimaryButton>
      </form>
    </Container>
  );
}
