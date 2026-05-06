import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginPayload } from '@/types/auth.types';

export function useLogin() {
    const { setUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: LoginPayload) =>
            authService.login(payload).then((res) => res.data),

        onSuccess: async () => {
            const profileRes = await authService.getMe();
            setUser(profileRes.data.data);
            router.push('/account');
        },
    });
}