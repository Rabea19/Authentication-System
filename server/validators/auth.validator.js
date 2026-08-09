import { z } from "zod";

const emailSchema = z
  .string({
    error: "Email is required",
  })
  .trim()
  .toLowerCase()
  .pipe(
    z.email({
      error: "Please enter a valid email address",
    }),
  );

const passwordSchema = z
  .string({
    error: "Password is required",
  })
  .min(8, {
    error: "Password must be at least 8 characters",
  });

const confirmPasswordSchema = z
  .string({
    error: "Password confirmation is required",
  })
  .min(1, {
    error: "Password confirmation is required",
  });

const registerSchema = z
  .object({
    name: z
      .string({
        error: "Name is required",
      })
      .trim()
      .min(2, {
        error: "Name must be at least 2 characters",
      })
      .max(50, {
        error: "Name cannot exceed 50 characters",
      }),

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

const verifyEmailSchema = z.object({
  email: emailSchema,

  code: z
    .string({
      error: "Verification code is required",
    })
    .trim()
    .regex(/^\d{6}$/, {
      error: "Verification code must be exactly 6 digits",
    }),
});

const resendVerificationCodeSchema = z.object({
  email: emailSchema,
});

const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string({
      error: "Password is required",
    })
    .min(1, {
      error: "Password is required",
    }),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z
  .object({
    token: z
      .string({
        error: "Password reset token is required",
      })
      .trim()
      .regex(/^[a-f0-9]{64}$/i, {
        error: "Invalid password reset token",
      }),

    password: passwordSchema,

    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        error: "Current password is required",
      })
      .min(1, {
        error: "Current password is required",
      }),

    newPassword: passwordSchema,

    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  });

export {
  registerSchema,
  verifyEmailSchema,
  resendVerificationCodeSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
