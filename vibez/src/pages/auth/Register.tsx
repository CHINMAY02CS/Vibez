import PublicLayout from "@/layout/PublicPage";
import { initialSignUpDetails, signUpSchema } from "@/schemas/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
export default function SignUp() {
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialSignUpDetails,
  });

  function onSubmit() {
    console.log("Registered");
  }

  return (
    <PublicLayout title="Vibez">
      <div className="flex flex-col items-center justify-center text-sm">
        Sign Up to see the latest photots and vidoes from your firends !
      </div>
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="flex flex-col justify-start py-4 text-left">
          <FormField
            control={signUpForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="py-0">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email here . . ." {...field} className="py-0" />
                </FormControl>
                <FormMessage className="py-0 text-red-700" />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name here . . ." {...field} />
                </FormControl>
                <FormMessage className="py-0 text-red-700" />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username here . . ." {...field} />
                </FormControl>
                <FormMessage className="py-0 text-red-700" />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password here . . ." {...field} />
                </FormControl>
                <FormMessage className="py-0 text-red-700" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center mt-8 mb-3">
            <Button type="submit" className="w-1/2">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-center text-sm">
        Sign Up to see the latest photots and vidoes from your firends and create beautiful memories!
      </div>
    </PublicLayout>
  );
}
