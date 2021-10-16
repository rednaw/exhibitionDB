<script>
	import Toggle from 'svelte-toggle';
	import { gallery, addImage, removeImage } from '../stores/galleryStore.js';

	export let object;
	export let metadata;

	async function inGallery(metadata) {
		const storedValue = await gallery.get();
		return storedValue.includes(metadata.image_url);
	}

	function toggle(toggleValue, imageUrl) {
		if (toggleValue) {
			addImage(imageUrl);
		} else {
			removeImage(imageUrl);
		}
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
				on:toggle={(e) => toggle(e.detail, metadata.image_url)}
				toggled={inGallery}
				on="In gallery"
				off="Not in gallery"
			/>
		</div>

		<div class="columns">
			<div class="left_column">
				<img src={metadata.image_url} alt={metadata.title} width="400" />
			</div>
			<div class="right_column">
				<p>
					<strong>Title:</strong>
					{metadata.title}
				</p>
				<p>
					<strong>Artist:</strong>
					{metadata.artist}
				</p>
				<p>
					<strong>Type:</strong>
					{metadata.type}
				</p>
				<p>
					<strong>Date:</strong>
					{metadata.date}
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
