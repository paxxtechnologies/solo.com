import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { VerifyEmailPayload } from '@/types/auth.types';

export function useVerifyEmail() {
    return useMutation({
        mutationFn: (payload: VerifyEmailPayload) =>
            authService.verifyEmailPost(payload).then((res) => res.data),
    });
}