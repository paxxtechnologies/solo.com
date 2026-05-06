import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useLogout() {
    const { clearUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: () => authService.logout().then((res) => res.data),
        onSettled: () => {
            clearUser();
            router.push('/login');
        },
    });
}