<script>
	import { gallery } from './stores/galleryStore.js';
	import { getContext } from 'svelte';
	import { showPopup } from './details/show.js';

	const { open } = getContext('simple-modal');

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

{#await gallery.get() then gallery}
	{#if gallery.length > 0}
		<div class="row">
			{#each gallery as item}
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
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
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
		transform: perspective(500px) rotateY(45deg);
		width: 90%;
	}
	.photoContainer:hover {
		animation-name: thumbTitle;
		animation-duration: 1s;
		animation-fill-mode: both;
		transition-timing-function: ease-in;
	}
	@keyframes thumbTitle {
		0% {
			transform: perspective(500px) rotateY(35deg) scale(1);
		}
		20% {
			transform: perspective(500px) rotateY(15deg) scale(1.1);
		}
		100% {
			transform: perspective(500px) rotateY(0deg) scale(1.2);
		}
	}
	.photoContainer:hover .photoInfo {
		animation-name: infoSlide;
		animation-duration: 1s;
		animation-fill-mode: both;
		transition-timing-function: ease-in;
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
	.photoContainer img {
		object-fit: cover;
		width: 100%;
		opacity: 0.5;
	}
	.photoContainer img:hover {
		animation-name: imgTransparency;
		animation-duration: 1s;
		animation-fill-mode: both;
		transition-timing-function: ease-in;
	}
	@keyframes imgTransparency {
		0% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
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
