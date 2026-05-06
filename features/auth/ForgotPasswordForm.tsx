'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { SoloLogo } from '@/components/ui/SoloLogo'
import { useToast } from '@/context/toast-context'
import { useForgotPassword } from '@/hooks/auth/useForgotPassword'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth.schemas'

export default function ForgotPasswordForm() {
  const { showToast } = useToast()
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, {
      onError: (err) => showToast(err.message, 'error'),
    })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <SoloLogo size="lg" />
            <span className="font-heading font-bold text-2xl text-foreground">
              Solo Gadgets
            </span>
          </Link>

          {isSuccess ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
                Check your inbox
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                If an account exists for that email, a password reset link has been sent.
                Check your spam folder if you don&apos;t see it.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Forgot password?
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">
              No worries, it happens
            </h2>
            <p className="text-lg text-white/80">
              We&apos;ll help you get back into your account in no time.
              Just check your email after submitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}