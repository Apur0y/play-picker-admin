// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { zodResolver } from "@hookform/resolvers/zod";
// import Cookies from "js-cookie";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import {useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import * as z from "zod";
// import { useSignInMutation } from "../../../redux/api/auth/authApi";
// import { setUser } from "../../../redux/features/user/userSlice";
// import CustomInput from "../../../ui/CustomeInput";
// import Logo from "../../shared/Logo";
// import PrimaryButton from "../../shared/primaryButton/PrimaryButton";

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// // Define Zod schema for validation
// const formSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Please enter a valid email address" })
//     .min(1, { message: "Email is required" }),
//   password: z
//     .string()
//     .min(6, { message: "Password should be at least 6 characters long" })
//     .min(1, { message: "Password is required" }),
//   rememberMe: z.boolean().optional(),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function SignInPage() {
//   // Use React Hook Form with Zod resolver
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       rememberMe: false,
//     },
//   });

//   const [signIn, { isLoading }] = useSignInMutation();

//   const router = useNavigate();
//   const dispatch = useDispatch();

//   const onSubmit = async (data: FormValues) => {
//     router("/dashboard")
// //     const params= 'device=mobile';
// //     const body = data;
// //     try {
// //       const response = await signIn({params,body}).unwrap();
// //        if (response?.data?.role !== "ADMIN") {
// //   toast.error("You are not Authorized!");
// //   return;  // Exit the function if the user isn't authorized
// // }
// //       if (response?.success) {
       
// //         if (response.data) {
// //           Cookies.set("adminToken", response.data.tokens.access);
// //           dispatch(
// //             setUser({
// //               token: response.data.adminToken,
// //             })
// //           );
// //           toast.success("Login successful");
// //           router("/dashboard");
// //         } else {
// //           router("/");
// //         }
        
// //       }
// //     } catch (error: any) {
  
// //       return toast.error(error?.data?.message || "Login failed");
// //     }
//   };

//   return (
//     <div className="w-full flex justify-center items-center">
//       <div className="w-full max-w-[624px] p-10 shadow-md rounded-lg border border-gray-100">
//         <div className="flex flex-col items-center mb-8">
//           <Logo className="w-[89px] h-[73px]" />
//           <h1 className="text-2xl font-medium my-12">Admin Login</h1>
       

//         </div>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
//           {/* Email Input */}
//           <CustomInput
//             id="email"
//             type="email"
//             label="Email Address"
//             placeholder="georgiayoung@example.com"
//             {...register("email")}
//             error={errors.email?.message}
//           />

//           {/* Password Input */}
//           <CustomInput
//             id="password"
//             type="password"
//             label="Password"
//             placeholder="••••••••••"
//             showPasswordToggle={true}
//             error={errors.password?.message}
//             {...register("password")}
//           />

//           {/* Remember Me and Forgot Password */}
//           {/* <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="rememberMe"
//                 type="checkbox"
//                 {...register("rememberMe")}
//               />
//               <label
//                 htmlFor="rememberMe"
//                 className="ml-2 text-sm text-gray-600"
//               >
//                 Remember Me
//               </label>
//             </div>
//             <Link
//               to="/forget-password"
//               className="text-sm text-red-500 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div> */}
//           {/* Login Button */}
//           <PrimaryButton type="submit" loading={isLoading} text="Log In" />
//         </form>
    
//       </div>
//     </div>
//   );
// }

export default function SignIn() {

  const router=useNavigate()
  useEffect(()=>{
router("/dashboard")
  })
  return (
    <div>SignIn</div>
  )
}

