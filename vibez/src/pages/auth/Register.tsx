import PublicLayout from "@/layout/PublicPage";
import { initialSignUpDetails, signUpSchema } from "@/schemas/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/elements/FormInput";
import { Link } from "react-router-dom";
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
      <PublicLayout title="Vibez" className="px-0 md:px-4">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="flex flex-col justify-start px-2 py-4 text-left md:p-4 gap-y-2"
          >
            <FormInput type="email" required name="email" form={signUpForm} label="Email" />
            <FormInput type="text" required name="name" form={signUpForm} label="Name" />
            <FormInput type="text" required name="username" form={signUpForm} label="Username" />
            <FormInput type="password" required name="password" form={signUpForm} label="Password" />
            <div className="text-sm text-center">
              By signing up, you agree to out Terms, privacy policy and cookies policy.
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button type="submit" className="w-1/2">
                Register
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-sm text-center">
          Already registered?{" "}
          <Link to="/login" className="text-purple-900">
            Login
          </Link>{" "}
        </div>
      </PublicLayout>
    </>
  );
}
