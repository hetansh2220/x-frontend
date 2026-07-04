"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { loginApi } from "@/api/authApi"
import { setCredentials } from "@/redux/authSlice"
import { useState } from "react"


export default function LoginForm({
  className,
  ...props
}) {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: data.user,
        accessToken: data.accessToken
      }));

      navigate("/home");
    },
    onError: (error) => {
      const message = error.response?.data?.msg || "Something went wrong"
      setServerError(message)
    }
  })

  const onSubmit = (FormData) => {
    loginMutation.mutate(FormData)
  }



  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <section
        className={cn(
          "w-full max-w-[28rem] rounded-lg border bg-card px-4 py-6 shadow-sm sm:px-8 sm:py-8",
          className
        )}
        {...props}>
        <div className="flex flex-col gap-6">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5 sm:gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Link to="/" className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex size-9 items-center justify-center rounded-md border bg-muted sm:size-10">
                    <GalleryVerticalEndIcon className="size-5 sm:size-6" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </Link>
                <h1 className="text-balance text-xl font-bold sm:text-2xl">Welcome to Acme Inc.</h1>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="username"
                  placeholder="Enter your username"
                  required
                  {...register("username", {
                    required: "Username is required"
                  })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  {...register("password", {
                    required: "Password is Required"
                  })}
                />
              </Field>
              <Field>
                <Button className="h-12" type="submit">Login</Button>
              </Field>
              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}
            </FieldGroup>
          </form>
          <FieldDescription className="px-0 text-center text-xs sm:px-6 sm:text-sm">
            By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link>{" "}
            and <Link to="/privacy">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </section>
    </main>
  );
}
