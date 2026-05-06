'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { SoloLogo } from '@/components/ui/SoloLogo'
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail'

export default function VerifyEmailView() {
  const searchParams = useSearchParams()
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail()
  const hasRun = useRef(false)

  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  useEffect(() => {
    if (!token || !email || hasRun.current) return
    hasRun.current = true
    verifyEmail({ token, email })
  }, [token, email])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <SoloLogo size="lg" />
          <span className="font-heading font-bold text-2xl text-foreground">
            Solo Gadgets
          </span>
        </Link>

        {/* Loading */}
        {isPending && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Verifying your email...
            </h1>
            <p className="text-muted-foreground text-sm">
              Just a moment while we confirm your address.
            </p>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Email verified!
            </h1>
            <p className="text-muted-foreground text-sm">
              Your email address has been verified successfully.
              You can now sign in to your account.
            </p>
            <Link
              href="/login"
              className="mt-4 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Verification failed
            </h1>
            <p className="text-muted-foreground text-sm">
              {error?.message ?? 'This verification link is invalid or has expired.'}
            </p>
            <Link
              href="/login"
              className="mt-4 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {/* No params */}
        {!isPending && !isSuccess && !isError && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Invalid link
            </h1>
            <p className="text-muted-foreground text-sm">
              This verification link is missing required information.
            </p>
            <Link
              href="/login"
              className="mt-4 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}