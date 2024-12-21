import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import PublicLayout from "@/layout/PublicPage";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/elements/FormInput";
import { initialSignUpDetails, signUpSchema } from "@/schemas/Auth";

export default function SignUp() {
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialSignUpDetails,
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
            <FormInput type="text" required name="name" form={signUpForm} label="Name" />
            <FormInput type="text" required name="username" form={signUpForm} label="Username" />
            <FormInput type="password" required name="password" form={signUpForm} label="Password" />
            <div className="text-center">By signing up, you agree to out Terms, privacy policy and cookies policy.</div>
            <div className="flex items-center justify-center mt-4">
              <Button type="submit" className="w-1/2">
                Register
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center">
          Already registered?{" "}
          <Link to="/login" className="text-purple-900">
            Login
          </Link>{" "}
        </div>
      </PublicLayout>
    </>
  );
}
