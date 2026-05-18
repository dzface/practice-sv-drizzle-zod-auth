<script lang="ts">
	import TodoList from '$lib/components/TodoList.svelte'; // 💡 컴포넌트 임포트
	import AuthForm from '$lib/components/AuthForm.svelte'; // 💡 인증 컴포넌트 임포트
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import TodoAppLayout from '$lib/components/TodoAppLayout.svelte';
	// Svelte 5: 서버 레이어에서 받아온 세션 & To-Do 데이터
	let { data } = $props();
</script>

<TodoAppLayout>
	{#if data.user}
		<TodoList user={data.user} todos={data.todos} />
		<LogoutButton/>
	{:else}
		<AuthForm/>
	{/if}
</TodoAppLayout>

<style>
	:global(body) { background-color: #f9f9fb; font-family: sans-serif; color: #333; margin: 0; }
</style>