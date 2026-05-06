'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { SoloLogo } from '@/components/ui/SoloLogo'
import { useToast } from '@/context/toast-context'
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/schemas/auth.schemas'

function getPasswordStrength(password: string): number {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
}

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['bg-destructive', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
const STRENGTH_TEXT = ['text-destructive', 'text-yellow-600', 'text-blue-600', 'text-green-600']

export default function ResetPasswordForm() {
    const { showToast } = useToast()
    const { mutate: resetPassword, isPending } = useResetPassword()
    const searchParams = useSearchParams()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Token and email come from the email link as query params
    const token = searchParams.get('token') ?? ''
    const email = searchParams.get('email') ?? ''

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email, token },
    })

    const passwordValue = watch('newPassword', '')
    const confirmValue = watch('confirmPassword', '')
    const passwordStrength = getPasswordStrength(passwordValue)

    const onSubmit = (values: ResetPasswordFormValues) => {
        resetPassword(values, {
            onError: (err) => showToast(err.message, 'error'),
            onSuccess: () => showToast('Password reset successfully!', 'success'),
        })
    }

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
                        Invalid reset link
                    </h1>
                    <p className="text-muted-foreground text-sm mb-6">
                        This password reset link is invalid or has expired.
                        Please request a new one.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Request new link <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        )
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

                    <div className="mb-8">
                        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                            Reset your password
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Choose a strong new password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Hidden fields */}
                        <input type="hidden" {...register('email')} />
                        <input type="hidden" {...register('token')} />

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    {...register('newPassword')}
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Create a new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordValue && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength
                                                        ? STRENGTH_COLORS[passwordStrength - 1]
                                                        : 'bg-border'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Password strength:{' '}
                                        <span className={`font-medium ${STRENGTH_TEXT[passwordStrength - 1] ?? 'text-destructive'}`}>
                                            {STRENGTH_LABELS[passwordStrength - 1] ?? 'Too weak'}
                                        </span>
                                    </p>
                                </div>
                            )}
                            {errors.newPassword && (
                                <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className={`w-full pl-12 pr-12 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${confirmValue && confirmValue !== passwordValue
                                            ? 'border-destructive'
                                            : 'border-border'
                                        }`}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
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
                                    Resetting password...
                                </>
                            ) : (
                                <>
                                    Reset Password <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right — Brand panel */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <h2 className="text-4xl font-heading font-bold mb-4">
                            Almost there
                        </h2>
                        <p className="text-lg text-white/80">
                            Set a strong password to keep your account safe.
                            You&apos;ll be signed in automatically after resetting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}