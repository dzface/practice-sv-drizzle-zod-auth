import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	// SvelteKit 내장 Better Auth 핸들러 경로가 기본적으로 /api/auth 이므로
	// 별도의 baseURL 설정 없이도 자동으로 알아서 매핑됩니다.
});