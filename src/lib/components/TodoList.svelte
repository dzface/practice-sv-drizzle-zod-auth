<script lang="ts">
	import { enhance } from '$app/forms';

	// Svelte 5: 부모 컴포넌트(+page.svelte)로부터 필요한 데이터를 props로 받습니다.
	let { user, todos } = $props<{
		user: { name: string; email: string };
		todos: Array<{ id: string; title: string }>;
	}>();
</script>

<header class="app-header">
	<div class="user-info">
		<strong>{user.name}</strong>님의 할 일 목록 📝
		<span class="email">({user.email})</span>
	</div>
	</header>

<section class="todo-form-section">
	<form method="POST" action="?/addTodo" use:enhance class="todo-form">
		<input 
			type="text" 
			name="title" 
			placeholder="새로운 할 일을 입력하세요..." 
			required 
			autocomplete="off"
		/>
		<button type="submit" class="btn-add">추가</button>
	</form>
</section>

<section class="todo-list-section">
	{#if todos.length === 0}
		<p class="empty-msg">아직 등록된 할 일이 없습니다. 첫 할 일을 등록해 보세요!</p>
	{:else}
		<ul class="todo-list">
			{#each todos as item (item.id)}
				<li class="todo-item">
					<span class="todo-title">{item.title}</span>
					
					<form method="POST" action="?/deleteTodo" use:enhance>
						<input type="hidden" name="id" value={item.id} />
						<button type="submit" class="btn-delete">지우기</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	/* 헤더 스타일 */
	.app-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; margin-bottom: 1.5rem; }
	.user-info { font-size: 1.1rem; }
	.email { font-size: 0.85rem; color: #888; }

	/* 투두 폼 스타일 */
	.todo-form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
	.todo-form input { flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
	.btn-add { padding: 0 1.2rem; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
	.btn-add:hover { background: #059669; }

	/* 리스트 스타일 */
	.empty-msg { text-align: center; color: #888; margin: 2rem 0; font-size: 0.95rem; }
	.todo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
	.todo-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; }
	.todo-title { font-size: 1rem; word-break: break-all; margin-right: 1rem; }
	.btn-delete { background: #ef4444; color: white; border: none; padding: 0.35rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
	.btn-delete:hover { background: #dc2626; }
</style>