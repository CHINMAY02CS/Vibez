import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";

interface FormInputProps {
  type: string;
  name: string;
  className?: string;
  form: any;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormInput({
  type,
  name,
  className = "",
  form,
  label,
  disabled,
  required = false,
}: FormInputProps) {
  switch (type) {
    case "text":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormLabel>
                  {label}
                  {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder={`Enter ${label} . . .`} {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "email":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <Input type={type} placeholder="Enter Email ID . . ." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "password":
      const [visible, setVisible] = useState(false);
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <div className="flex items-end">
                <FormControl>
                  <Input
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Type here . . ."
                    {...field}
                  />
                </FormControl>
                {visible ? (
                  <Eye className="self-center w-5 h-5 -ml-10 cursor-pointer" onClick={() => setVisible(!visible)} />
                ) : (
                  <EyeOff className="self-center w-5 h-5 -ml-10 cursor-pointer" onClick={() => setVisible(!visible)} />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  {label} {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={`Enter ${label} . . .`}
                    {...field}
                    className={className}
                    disabled={disabled ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
  }
}

export const RequiredField = () => <span className="ml-1 text-red-700">*</span>;
