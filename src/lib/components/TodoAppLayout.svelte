<script lang="ts">
	import type { Snippet } from 'svelte';
	// Svelte 5: 자식 마크업을 받아오기 위해 children 프로프를 정의
	// { children: Snippet } 이부분은 children의 Snippet 타입을 알려줌
	let { children }: { children: Snippet } = $props();
</script>

<main class="todo-app">
	{@render children()}
</main>

<style>
	/* 앱 카드 스타일 */
	.todo-app { 
		max-width: 550px; 
		margin: 4rem auto; 
		padding: 2rem; 
		background: #fff; 
		border-radius: 12px; 
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); 
	}
</style>