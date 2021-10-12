<script>
	import Toggle from 'svelte-toggle';
	import { gallery, addImage, removeImage } from '../stores/galleryStore.js';

	export let object;

	async function inGallery(metadata) {
		const storedValue = await gallery.get();
		return storedValue.includes(metadata.objectImage);
	}

	function toggle(toggleValue, imageUrl) {
		if (toggleValue) {
			addImage(imageUrl);
		} else {
			removeImage(imageUrl);
		}
	}
</script>

{#await inGallery(object)}
	<p>...loading</p>
{:then inGallery}
	<div>
		<Toggle
			hideLabel="true"
			on:toggle={(e) => toggle(e.detail, object.objectImage)}
			toggled={inGallery}
			on="In gallery"
			off="Not in gallery"
		/>
	</div>

	<div class="columns">
		<div class="left_column">
			<img src={object.objectImage} alt={object.objectTitle} width="400" />
		</div>
		<div class="right_column">
			<p>
				<strong>Title:</strong>
				{object.objectTitle}
			</p>
			<p>
				<strong>Artist:</strong>
				{object.objectCreator}
			</p>
			<p>
				<strong>Type:</strong>
				{object.objectType}
			</p>
			<p>
				<strong>Date:</strong>
				{object.objectCreationDate}
			</p>
		</div>
	</div>
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
