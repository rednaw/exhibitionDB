<script>
	import Toggle from 'svelte-toggle';
	import { gallery, addImage, removeImage } from '../stores/galleryStore.js';

	export let object;

	async function inGallery(metadata) {
		const storedValue = await gallery.get();
		return storedValue.includes(metadata.primaryImageSmall);
	}

	let metadata = async function (object) {
		let result =
			'https://collectionapi.metmuseum.org/public/collection/v1/objects/' +
			object.id;
		result = await fetch(result);
		return await result.json();
	};

	function toggle(toggleValue, imageUrl) {
		if (toggleValue) {
			addImage(imageUrl);
		} else {
			removeImage(imageUrl);
		}
	}
</script>

{#await metadata(object)}
	<p>...loading</p>
{:then metadata}
	{#await inGallery(metadata)}
		<p>...loading</p>
	{:then inGallery}
		<div>
			<Toggle
				hideLabel="true"
				on:toggle={(e) => toggle(e.detail, metadata.primaryImageSmall)}
				toggled={inGallery}
				on="In gallery"
				off="Not in gallery"
			/>
		</div>

		<div class="columns">
			<div class="left_column">
				<img src={metadata.primaryImageSmall} alt={object.title} width="400" />
			</div>
			<div class="right_column">
				<p>
					<strong>Title:</strong>
					{object.title}
				</p>
				<p>
					<strong>Artist:</strong>
					{object.artist}
				</p>
				<p>
					<strong>Type:</strong>
					{object.type}
				</p>
				<p>
					<strong>Date:</strong>
					{object.date}
				</p>
			</div>
		</div>
	{/await}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style>
	.columns {
		display: flex;
		padding-top: 25px;
	}
	.left_column {
		flex: 70%;
	}
	.right_column {
		flex: 30%;
	}
</style>
