import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { ResetPasswordPayload } from '@/types/auth.types';

export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) =>
            authService.resetPassword(payload).then((res) => res.data),
        onSuccess: () => router.push('/login'),
    });
}