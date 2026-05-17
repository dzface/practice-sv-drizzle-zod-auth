<script lang="ts">
	import { authClient } from '$lib/authClient';
	import { invalidateAll } from '$app/navigation';
	import TodoList from '$lib/components/TodoList.svelte'; // 💡 컴포넌트 임포트

	// Svelte 5: 서버 데이터 받아오기
	let { data } = $props();

	// Runes: 인증 관련 상태 관리
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let authMode = $state<'login' | 'register'>('login');

	// 회원가입
	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.signUp.email({ email, password, name, callbackURL: '/' });
		if (error) alert(error.message);
		else { alert('회원가입 완료!'); await invalidateAll(); }
	}

	// 로그인
	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.signIn.email({ email, password });
		if (error) alert('로그인 실패. 정보를 확인하세요.');
		else await invalidateAll();
	}

	// 로그아웃
	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll();
	}
</script>

<main class="todo-app">
	{#if data.user}
		<TodoList user={data.user} todos={data.todos} />
		
		<div style="margin-top: 1rem; text-align: right;">
			<button onclick={handleLogout} class="btn-logout">로그아웃</button>
		</div>
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
				<p class="toggle-text">계정이 없으신가요? <button onclick={() => authMode = 'register'} class="btn-link">회원가입하기</button></p>
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
				<p class="toggle-text">이미 계정이 있으신가요? <button onclick={() => authMode = 'login'} class="btn-link">로그인하기</button></p>
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

	.btn-logout { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
	.btn-logout:hover { background: #e5e7eb; }
</style>