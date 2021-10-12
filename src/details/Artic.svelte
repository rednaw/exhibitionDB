<script>
	import Toggle from 'svelte-toggle';
	import { gallery, addImage, removeImage } from '../stores/galleryStore.js';

	export let object;

	async function inGallery(metadata) {
		const storedValue = await gallery.get();
		return storedValue.includes(imageUrl(metadata.data.image_id));
	}

	let metadata = async function (object) {
		let result = 'https://api.artic.edu/api/v1/exhibitions/' + object.id;
		result = await fetch(result);
		return await result.json();
	};

	function toggle(toggleValue, imageId) {
		if (toggleValue) {
			addImage(imageUrl(imageId));
		} else {
			removeImage(imageUrl(imageId));
		}
	}

	function imageUrl(imageId) {
		return `https://lakeimagesweb.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
	}
</script>

{#await metadata(object)}
	<p>...loading object metadata</p>
{:then metadata}
	{#await inGallery(metadata)}
		<p>...loading gallery</p>
	{:then inGallery}
		<div>
			<Toggle
				hideLabel="true"
				on:toggle={(e) => toggle(e.detail, metadata.data.image_id)}
				toggled={inGallery}
				on="In gallery"
				off="Not in gallery"
			/>
		</div>
		<div class="columns">
			<div class="left_column">
				<img
					src={imageUrl(metadata.data.image_id)}
					alt={metadata.data.title}
					width="400"
				/>
			</div>
			<div class="right_column">
				<p>
					<strong>Title:</strong>
					{metadata.data.title}
				</p>
			</div>
		</div>
		{#if metadata.data.short_description}
			<p>
				<strong>Short description:</strong>
				{metadata.data.short_description}
			</p>
		{/if}
		{#if metadata.data.description}
			<p>
				<strong>Description:</strong>
				{metadata.data.description}
			</p>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
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
