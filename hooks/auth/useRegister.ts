import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { RegisterPayload } from '@/types/auth.types';

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: RegisterPayload) =>
            authService.register(payload).then((res) => res.data),

        // React query provides the payload as the second argument (variables)
        onSuccess: (data, payload) => {
            // Encode the email so it's safe for the URL
            const emailParam = encodeURIComponent(payload.email);
            router.push(`/registration-success?email=${emailParam}`);
        },
    });
}