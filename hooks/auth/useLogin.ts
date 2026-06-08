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
            const user = profileRes.data.data;
            setUser(user);

            if (user.isAdmin || user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/account');
            }
        },
    });
}