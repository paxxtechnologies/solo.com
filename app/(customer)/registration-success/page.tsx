'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';
import { SoloLogo } from '@/components/ui/SoloLogo';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your email address';

    return (
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
            <div className="mx-auto w-full max-w-sm text-center">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
                    Check your email
                </h1>

                <p className="text-muted-foreground text-sm mb-8">
                    We've sent a verification link to <br />
                    <span className="font-medium text-foreground">{email}</span>. <br />
                    Please verify your email address to complete your registration.
                </p>

                <Link
                    href="/login"
                    className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    Continue to Login <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}

export default function RegistrationSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header matching your brand */}
            <header className="p-6 absolute top-0 left-0 w-full flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <SoloLogo size="md" />
                    <span className="font-heading font-bold text-xl text-foreground">Solo Gadgets</span>
                </Link>
            </header>

            {/* Suspense is required by Next.js when using useSearchParams in a client component */}
            <Suspense fallback={<div className="flex-1 flex items-center justify-center" />}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}