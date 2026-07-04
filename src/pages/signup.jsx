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
import { GalleryVerticalEndIcon, RefreshCwIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { registerApi } from "@/api/authApi"
import { setCredentials } from "@/redux/authSlice"
import { useState } from "react"

const anonymousPrefixes = ["silent", "hidden", "shadow", "pixel", "ghost", "nova"]
const anonymousWords = ["orbit", "signal", "mask", "byte", "drift", "echo"]

const createAnonymousName = () => {
  const prefix = anonymousPrefixes[Math.floor(Math.random() * anonymousPrefixes.length)]
  const word = anonymousWords[Math.floor(Math.random() * anonymousWords.length)]
  const number = Math.floor(100 + Math.random() * 900)
  return `${prefix}_${word}_${number}`
}

export default function Signup({
  className,
  ...props
}) {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      username: createAnonymousName(),
    },
  })

  const refreshUsername = () => {
    setValue("username", createAnonymousName(), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      console.log("REGISTER SUCCESS:", data);
      dispatch(setCredentials({
        user: data.user,
        accessToken: data.accessToken
      }));
      console.log(data.user)
      console.log(data.accessToken)
      navigate("/home");
    },
    onError: (error) => {
      const message = error.response?.data?.msg || "Something went wrong"
      setServerError(message)
    }
  });

  const onSubmit = (FormData) => {
    registerMutation.mutate(FormData)
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
                <h1 className="text-balance text-xl font-bold sm:text-2xl">Create your account</h1>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username", {
                      required: "Username is Required"
                    })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={refreshUsername}
                    aria-label="Generate anonymous username"
                    title="Generate anonymous username"
                  >
                    <RefreshCwIcon />
                  </Button>
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  {...register("password", {
                    required: "Email is Required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button className="h-12" type="submit">Create Account</Button>
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
