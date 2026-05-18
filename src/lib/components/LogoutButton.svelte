<script>
	import { authClient } from '$lib/authClient';
	import { invalidateAll } from '$app/navigation';
	// 로그아웃
	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll();
	}
</script>

<div class="logout-container">
	<button onclick={handleLogout} class="btn-logout">로그아웃</button>
</div>

<style>
  .logout-container { margin-top: 1rem; text-align: right; }
	.btn-logout { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
	.btn-logout:hover { background: #e5e7eb; }
</style>