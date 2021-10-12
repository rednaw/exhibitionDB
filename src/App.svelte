<script>
	import Table from './Table.svelte';
	import Modal from 'svelte-simple-modal';
	import Gallery from './Gallery.svelte';
	import { queries, title } from './stores/databaseStore.js';
</script>

<div class="navbar">
	<b><a href="./#" on:click={() => title.set('Gallery')}>Home</a></b>
	{#each Object.keys($queries) as key}
		<a href="./#" on:click={() => title.set(key)}>{key}</a>
	{/each}
</div>
<div class="main">
	<Modal>
		{#if $title == 'Gallery'}
			<Gallery />
		{:else}
			<Table />
		{/if}
	</Modal>
</div>

<style>
	.navbar {
		z-index: 1;
		overflow: hidden;
		background-color: #333;
		position: fixed;
		top: 0;
		width: 100%;
	}

	.navbar a {
		float: left;
		display: block;
		color: #f2f2f2;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
	}

	.navbar a:hover {
		background: #ddd;
		color: black;
	}

	.main {
		padding-top: 50px;
	}
</style>
