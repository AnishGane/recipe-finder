import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum of 3 character required."),
  email: z
    .email(),
  password: z
    .string()
    .min(6, "Password must be more than 6 characters."),
  confirmPassword: z
    .string()
    .min(6, "Password must be more than 6 characters."),
})

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data)
  }
  return (
    <form id="form-rhf-demo" className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="relative">
            <h1 className="text-2xl font-semibold">Create a new account</h1>
            <img src="/Brush.svg" alt="brush" className="absolute -top-10 -right-4 size-28" />
          </div>
          <p className="text-muted/80 text-xs text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <div className="space-y-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-demo-name" className="font-normal">
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="kimmy"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-demo-email" className="font-normal">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="kimmy@example.com"
                  autoComplete="off"
                />
                <FieldDescription className="text-[11px] pt-1 text-muted">
                  We&apos;ll use this to contact you. We will not share your email
                  with anyone else.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-demo-password" className="font-normal">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="form-rhf-demo-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    type={showPassword.password ? "text" : "password"}
                  />
                  {showPassword.password ? (
                    <EyeIcon onClick={() => setShowPassword({
                      ...showPassword,
                      password: false
                    })} className="size-3.5 absolute right-3 top-3" />
                  ) : (
                    <EyeOffIcon onClick={() => setShowPassword({
                      ...showPassword,
                      password: true
                    })} className="size-3.5 absolute top-3 right-3" />
                  )}
                  <FieldDescription className="text-[11px] pt-1.5 text-muted">
                    Must be atleast 6 characters.
                  </FieldDescription>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-demo-confirmPassword" className="font-normal">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="form-rhf-demo-confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    type={showPassword.confirmPassword ? "text" : "password"}
                  />
                  {showPassword.confirmPassword ? (
                    <EyeIcon onClick={() => setShowPassword({
                      ...showPassword,
                      confirmPassword: false
                    })} className="size-3.5 absolute right-3 top-3" />
                  ) : (
                    <EyeOffIcon onClick={() => setShowPassword({
                      ...showPassword,
                      confirmPassword: true
                    })} className="size-3.5 absolute top-3 right-3" />
                  )}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Field>
          <Button type="submit" variant={"destructive"} className="cursor-pointer">Create Account</Button>
        </Field>
        <Field className="-mt-2">
          <FieldDescription className="px-6 text-center text-muted">
            Already have an account? <Link to={"/login"} className="group relative inline-block">
              <span className="font-light">Sign in</span>
              <span className="absolute bottom-0 left-0 group-hover:w-full w-0 h-px bg-destructive transition-all duration-200" />
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
