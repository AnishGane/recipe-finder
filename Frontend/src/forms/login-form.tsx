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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { loginFormSchema } from "@/validations/auth-schema"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, login, setError } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setError(null);

    login(data.email, data.password);
  }

  return (
    <form id="form-rhf-demo" className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="relative text-center">
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          <img src="/Brush.svg" alt="brush" className="absolute -top-11 right-10 size-29" />
        </div>

        {error && (
          <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

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
                  type={showPassword ? "text" : "password"}
                />
                {showPassword ? (
                  <EyeIcon onClick={() => setShowPassword(false)} className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <EyeOffIcon onClick={() => setShowPassword(true)} className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={loading} variant={"destructive"} className="cursor-pointer">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin size-4" />
                Login
              </div>
            ) : "Login"}
          </Button>
        </Field>
        <Field className="-mt-2">
          <FieldDescription className="text-center text-muted">
            Don&apos;t have an account?{" "}
            <Link to={"/signup"} className="group relative inline-block">
              <span className="font-light">Sign up</span>
              <span className="absolute bottom-0 left-0 group-hover:w-full w-0 h-px bg-destructive transition-all duration-200" />
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
