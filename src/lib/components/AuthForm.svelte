<script lang="ts">
	import { authClient } from '$lib/authClient';
	import { invalidateAll } from '$app/navigation';

	// Svelte 5 Runes: 컴포넌트 내부에서만 사용하는 인증 폼 상태
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let authMode = $state<'login' | 'register'>('login');

	// 1. 회원가입 처리
	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.signUp.email({
			email,
			password,
			name,
			callbackURL: '/'
		});

		if (error) {
			alert(error.message || '회원가입 중 오류가 발생했습니다.');
		} else {
			alert('회원가입이 완료되었습니다!');
			await invalidateAll(); // 부모(+page.svelte)의 data.user 최신화 유도
		}
	}

	// 2. 로그인 처리
	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		const { error } = await authClient.signIn.email({
			email,
			password
		});

		if (error) {
			alert(error.message || '이메일 또는 비밀번호를 확인해주세요.');
		} else {
			await invalidateAll(); // 로그인 성공 후 세션 동기화
		}
	}
</script>

<div class="auth-card">
	<h2>{authMode === 'login' ? '로그인' : '회원가입'}</h2>
	
	{#if authMode === 'login'}
		<form onsubmit={handleLogin} class="auth-form">
			<label for="login-email">이메일</label>
			<input id="login-email" type="email" bind:value={email} placeholder="example@email.com" required />
			
			<label for="login-password">비밀번호</label>
			<input id="login-password" type="password" bind:value={password} placeholder="••••••••" required />
			
			<button type="submit" class="btn-primary">로그인</button>
		</form>
		<p class="toggle-text">
			계정이 없으신가요? 
			<button onclick={() => authMode = 'register'} class="btn-link">회원가입하기</button>
		</p>
	{:else}
		<form onsubmit={handleRegister} class="auth-form">
			<label for="reg-name">이름</label>
			<input id="reg-name" type="text" bind:value={name} placeholder="홍길동" required />

			<label for="reg-email">이메일</label>
			<input id="reg-email" type="email" bind:value={email} placeholder="example@email.com" required />
			
			<label for="reg-password">비밀번호</label>
			<input id="reg-password" type="password" bind:value={password} placeholder="••••••••" required />
			
			<button type="submit" class="btn-primary">가입하기</button>
		</form>
		<p class="toggle-text">
			이미 계정이 있으신가요? 
			<button onclick={() => authMode = 'login'} class="btn-link">로그인하기</button>
		</p>
	{/if}
</div>

<style>
	.auth-card h2 { margin-top: 0; margin-bottom: 1.5rem; text-align: center; }
	.auth-form { display: flex; flex-direction: column; gap: 0.8rem; }
	.auth-form input { padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
	.btn-primary { padding: 0.75rem; background: #4f46e5; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; margin-top: 0.5rem; }
	.btn-primary:hover { background: #4338ca; }
	.toggle-text { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #666; }
	.btn-link { background: none; border: none; color: #4f46e5; text-decoration: underline; cursor: pointer; font-size: 0.9rem; padding: 0; }
</style>