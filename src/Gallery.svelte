<script>
	import { gallery } from './stores/galleryStore.js';

	async function imageLinks() {
		return await gallery.get();
	}

	function imageAction(node, url) {
		node.src = url;
		node.addEventListener('click', () => imageClick(url));
		return {
			update(url) {
				node.src = url;
			},
			destroy() {
				node.removeEventListener('input', imageClick);
			},
		};
	}

	function imageClick(url) {
		console.log(url);
	}
</script>

<svelte:head>
	<style>
		body {
			margin: 0;
			width: 100%;
			height: 2048px;

			background-image: url('images/background.webp');
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
	</style>
</svelte:head>

{#await imageLinks() then imageLinks}
	{#if imageLinks.length > 0}
		<div class="row">
			{#each imageLinks as imageLink}
				<div class="thumbnail">
					<div class="photoContainer">
						<img alt="" use:imageAction={imageLink} />
						<div class="photoInfo">
							<span class="photoInfoText">
								"Armchair"
								<br />
								Pottier and Stymus, 1870–75
							</span>
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
		grid-gap: 50px;
	}

	.thumbnail {
		justify-self: center;
		transition: 0.5s;
	}

	.photoContainer {
		border: 10px solid #000;
		position: relative;
		transform: perspective(500px) rotateY(5deg);
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
			transform: perspective(500px) rotateY(5deg) scale(1);
		}
		20% {
			transform: perspective(500px) rotateY(-10deg) scale(1.1);
		}
		100% {
			transform: perspective(500px) rotateY(0deg) scale(1.3);
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
		height: 320px;
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
		text-align: center;
	}

	.photoInfoText {
		color: grey;
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
