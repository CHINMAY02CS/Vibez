import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import PublicLayout from "@/layout/PublicPage";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/elements/FormInput";
import { initialSignInDetails, signInSchema } from "@/schemas/Auth";

export default function Login() {
  const signUpForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: initialSignInDetails,
  });

  function onSubmit() {
    console.log("Registered");
  }

  return (
    <>
      <PublicLayout title="Vibez" className="px-0 text-sm md:px-4">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="flex flex-col justify-start px-2 py-4 text-left md:p-4 gap-y-2"
          >
            <FormInput type="email" required name="email" form={signUpForm} label="Email" />
            <FormInput type="password" required name="password" form={signUpForm} label="Password" />
            <div className="flex items-center justify-center mt-4">
              <Button type="submit" className="w-1/2">
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center">
          New User?{" "}
          <Link to="/register" className="text-purple-900">
            Register
          </Link>{" "}
        </div>
      </PublicLayout>
    </>
  );
}
