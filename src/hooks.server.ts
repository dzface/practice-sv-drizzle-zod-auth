import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks'; // 💡 sequence 추가
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// 1. Better Auth 내부 API 라우팅을 처리하는 핸들러
const handleBetterAuth: Handle = ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

// 2. 일반 페이지 요청 시 유저 세션을 파싱해서 locals에 넣어주는 핸들러
const handleSession: Handle = async ({ event, resolve }) => {
	// Better Auth 라우트(/api/auth/*)인 경우 세션 체크를 스킵하여 데이터베이스 부하 방지
	if (!event.url.pathname.startsWith('/api/auth')) {
		const session = await auth.api.getSession({ 
			headers: event.request.headers 
		});

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		} else {
			event.locals.session = null;
			event.locals.user = null;
		}
	}

	return resolve(event);
};

// 3. 순서대로 실행되도록 sequence로 묶어서 내보내기
export const handle: Handle = sequence(handleBetterAuth, handleSession);