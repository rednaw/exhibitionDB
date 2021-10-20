<script>
	import { onMount } from 'svelte';
	import { gallery } from './stores/galleryStore.js';
	import * as interactable from './interactable.js';
	import { getContext } from 'svelte';
	import { showPopup } from './details/show.js';
	const { open } = getContext('simple-modal');

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

			on:mouseup={interactable.mouseUp};
			on:mousedown={interactable.mouseDown};
			on:mousemove={interactable.mouseMove};
		}
	</style>
</svelte:head>

{#if galleryItems.length > 0}
	<div class="row">
		{#each galleryItems as item}
			<div class="thumbnail">
				<div class="photoContainer">
					<img alt="" src={item.image_url} />
					<div class="photoInfo" on:click={showPopup(open, 'Gallery', item)}>
						<h3>"{item.title}"</h3>
						<span class="paintingDate">{item.artist}, {item.date}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="introduction">
		<b>Welcome to ExhibitionDB</b>
		<br /><br />
		Create your own art gallery:
		<ol>
			<li>Select a museum from the top menu.</li>
			<li>Browse the museum artworks using the interactive table.</li>
			<li>Select artworks to add them to your collection.</li>
		</ol>
		Your gallery will appear here.
	</div>
{/if}

<style>
	.row {
		margin: 40px auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
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
	.thumbnail:hover {
		z-index: 1;
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
	.photoContainer:hover .photoInfo {
		animation-name: infoSlide;
		animation-duration: 1s;
		animation-fill-mode: both;
		transition-timing-function: ease-in;
		cursor: pointer;
	}
	@keyframes infoSlide {
		0% {
			opacity: 0;
			transform: translateX(2.4em);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
			visibility: visible;
		}
	}

	div.introduction {
		position: fixed;
		width: 500px;
		height: 200px;
		margin: 10% auto;
		left: 0;
		right: 0;
		border: 2px solid grey;
		background-color: black;
		padding: 1em;
		color: white;
	}
</style>
