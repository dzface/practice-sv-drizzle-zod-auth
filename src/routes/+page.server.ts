import { db } from '$lib/server/db';
import { todo } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

// 1. 데이터 로드: 페이지가 열릴 때 인증 정보와 To-Do 목록을 가져옵니다.
export const load: PageServerLoad = async ({ locals }) => {
	// 로그인하지 않은 사용자는 To-Do 리스트를 비워서 보냄
	if (!locals.user) {
		return {
			user: null,
			todos: []
		};
	}

	// 로그인한 유저의 To-Do 목록을 최신순으로 조회
	const userTodos = await db
		.select()
		.from(todo)
		.where(eq(todo.userId, locals.user.id))
		.orderBy(desc(todo.createdAt));

	return {
		user: locals.user,
		todos: userTodos
	};
};

// 2. Form Actions: 인증은 클라이언트가 처리하지만, "To-Do 추가/삭제" 같은 DB 작업은 여전히 Form Action이 가장 빠르고 편합니다.
export const actions: Actions = {
	// To-Do 추가
	addTodo: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: '로그인이 필요합니다.' });
		}

		const data = await request.formData();
		const title = data.get('title') as string;

		if (!title || title.trim() === '') {
			return fail(400, { message: '할 일을 입력해주세요.' });
		}

		await db.insert(todo).values({
			userId: locals.user.id,
			title: title.trim()
		});

		return { success: true };
	},

	// To-Do 삭제
	deleteTodo: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: '로그인이 필요합니다.' });
		}

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { message: '잘못된 접근입니다.' });

		await db.delete(todo).where(
			eq(todo.id, id)
		);

		return { success: true };
	}
};