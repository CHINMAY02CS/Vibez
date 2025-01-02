"use client";

import { z } from "zod";

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must not exceed 30 characters." })
    .nonempty({ message: "Name is required." }),
  email: z.string().email({ message: "Must be a valid email address." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(20, { message: "Username must not exceed 20 characters." })
    .nonempty({ message: "Username is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password must not exceed 20 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one digit." })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)." }),
});

export const initialSignUpDetails = {
  name: "",
  email: "",
  username: "",
  password: "",
};

export type SignInFormData = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password must not exceed 20 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one digit." })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)." }),
});

export const initialSignInDetails = {
  email: "",
  password: "",
};
