<script lang="ts">
	import { authClient } from '$lib/authClient';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	// Svelte 5: 서버(+page.server.ts)에서 넘겨준 데이터 받기
	let { data } = $props();

	// Svelte 5 Runes: 인증 폼 입력값 상태 관리
	let email = $state('');
	let password = $state('');
	let name = $state('');

	// 인증 모드 토글 상태 ('login' 또는 'register')
	let authMode = $state<'login' | 'register'>('login');

	// 1. 회원가입 처리
	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		const { data: res, error } = await authClient.signUp.email({
			email,
			password,
			name,
			callbackURL: '/'
		});

		if (error) {
			alert(error.message || '회원가입 중 오류가 발생했습니다.');
		} else {
			alert('회원가입이 완료되었습니다!');
			await invalidateAll(); // 서버 데이터 새로고침 (locals 상태 반영)
		}
	}

	// 2. 로그인 처리
	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		const { data: res, error } = await authClient.signIn.email({
			email,
			password
		});

		if (error) {
			alert(error.message || '이메일 또는 비밀번호를 확인해주세요.');
		} else {
			await invalidateAll(); // 로그인 성공 후 유저 정보 동기화
		}
	}

	// 3. 로그아웃 처리
	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll(); // 로그아웃 후 화면 갱신
	}
</script>

<main class="todo-app">
	{#if data.user}
		<header class="app-header">
			<div class="user-info">
				<strong>{data.user.name}</strong>님의 할 일 목록 📝
				<span class="email">({data.user.email})</span>
			</div>
			<button onclick={handleLogout} class="btn-logout">로그아웃</button>
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
			{#if data.todos.length === 0}
				<p class="empty-msg">아직 등록된 할 일이 없습니다. 첫 할 일을 등록해 보세요!</p>
			{:else}
				<ul class="todo-list">
					{#each data.todos as item (item.id)}
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

	{:else}
		<div class="auth-card">
			<h2>{authMode === 'login' ? '로그인' : '회원가입'}</h2>
			
			{#if authMode === 'login'}
				<form onsubmit={handleLogin} class="auth-form">
					<label>이메일</label>
					<input type="email" bind:value={email} placeholder="example@email.com" required />
					
					<label>비밀번호</label>
					<input type="password" bind:value={password} placeholder="••••••••" required />
					
					<button type="submit" class="btn-primary">로그인</button>
				</form>
				<p class="toggle-text">
					계정이 없으신가요? 
					<button onclick={() => authMode = 'register'} class="btn-link">회원가입하기</button>
				</p>
			{:else}
				<form onsubmit={handleRegister} class="auth-form">
					<label>이름</label>
					<input type="text" bind:value={name} placeholder="홍길동" required />

					<label>이메일</label>
					<input type="email" bind:value={email} placeholder="example@email.com" required />
					
					<label>비밀번호</label>
					<input type="password" bind:value={password} placeholder="••••••••" required />
					
					<button type="submit" class="btn-primary">가입하기</button>
				</form>
				<p class="toggle-text">
					이미 계정이 있으신가요? 
					<button onclick={() => authMode = 'login'} class="btn-link">로그인하기</button>
				</p>
			{/if}
		</div>
	{/if}
</main>

<style>
	:global(body) { background-color: #f9f9fb; font-family: sans-serif; color: #333; margin: 0; }
	.todo-app { max-width: 550px; margin: 4rem auto; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
	
	/* 인증 스타일 */
	.auth-card h2 { margin-top: 0; margin-bottom: 1.5rem; text-align: center; }
	.auth-form { display: flex; flex-direction: column; gap: 0.8rem; }
	.auth-form input { padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
	.btn-primary { padding: 0.75rem; background: #4f46e5; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; margin-top: 0.5rem; }
	.btn-primary:hover { background: #4338ca; }
	.toggle-text { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #666; }
	.btn-link { background: none; border: none; color: #4f46e5; text-decoration: underline; cursor: pointer; font-size: 0.9rem; padding: 0; }

	/* 헤더 스타일 */
	.app-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; margin-bottom: 1.5rem; }
	.user-info { font-size: 1.1rem; }
	.email { font-size: 0.85rem; color: #888; }
	.btn-logout { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
	.btn-logout:hover { background: #e5e7eb; }

	/* 투두 폼 스타일 */
	.todo-form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
	.todo-form input { flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
	.btn-add { padding: 0 1.2rem; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
	.btn-add:hover { background: #059669; }

	/* 리스트 스타일 */
	.empty-msg { text-align: center; color: #888; margin: 2rem 0; font-size: 0.95rem; }
	.todo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
	.todo-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #ffebf1; border: 1px solid #f3e8ff; border-radius: 8px; transition: background 0.2s; }
	.todo-title { font-size: 1rem; word-break: break-all; margin-right: 1rem; }
	.btn-delete { background: #ef4444; color: white; border: none; padding: 0.35rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
	.btn-delete:hover { background: #dc2626; }
</style>