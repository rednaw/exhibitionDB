<script>
	import { onMount } from 'svelte';
	import { gallery } from './stores/galleryStore.js';
	import * as interactable from './interactable.js';
	import { getContext } from 'svelte';
	import { showPopup } from './details/show.js';
	const { open } = getContext('simple-modal');

	let canvas;

	let galleryItems = [];
	const fetchGallery = async () => {
		galleryItems = await gallery.get();
	};

	onMount(async () => {
		await fetchGallery();
		const elements = [...document.querySelectorAll('.thumbnail')];
		if (elements) {
			for (const el of elements) {
				interactable.init(el);
			}
		}
	});

	function imageAction(node, metadata) {
		node.src = metadata.image_url;
		node.addEventListener('click', () => imageClick(metadata));
		return {
			update(metadata) {
				node.src = metadata.image_url;
			},
			destroy() {
				node.removeEventListener('input', imageClick);
			},
		};
	}

	function imageClick(metadata) {
		showPopup(open, 'Gallery', metadata);
	}
</script>

<svelte:head>
	<style>
		body {
			margin: 0;
			width: 100%;
			height: 2048px;

			background-image: url('static/images/background.webp');
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
	</style>
</svelte:head>

<div
	bind:this={canvas}
	id="container"
	on:mouseup={interactable.mouseUp}
	on:mousedown={interactable.mouseDown}
	on:mousemove={interactable.mouseMove}
>
	<div class="row">
		{#each galleryItems as item}
			<div class="thumbnail">
				<div class="photoContainer">
					<img alt="" use:imageAction={item} />
					<div class="photoInfo">
						<h3>"{item.title}"</h3>
						<span class="paintingDate">{item.artist}, {item.date}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	#container {
		background: transparent;
		height: 2048px;
	}
	.row {
		margin: 40px auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 90%;
		grid-column-gap: 1%;
	}
	.thumbnail {
		justify-self: center;
		transition: 0.5s;
	}
	.photoContainer {
		border: 10px solid #000;
		text-align: center;
		position: relative;
		width: 90%;
	}
	.photoContainer img {
		object-fit: cover;
		width: 100%;
	}
	.photoInfo {
		background-color: black;
		color: white;
		position: absolute;
		bottom: 0px;
		text-align: center;
		visibility: hidden;
	}
	.photoInfo h3 {
		margin: 7px 10px;
		font-size: 14px;
		font-weight: bold;
	}
	.photoInfo .paintingDate {
		text-decoration: none;
		font-size: 12px;
		padding: 2px;
	}
</style>
