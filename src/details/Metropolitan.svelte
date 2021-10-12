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
			object.Object_ID;
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
	<p>...loading object metadata</p>
{:then metadata}
	{#await inGallery(metadata)}
		<p>...loading gallery</p>
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
				<img
					src={metadata.primaryImageSmall}
					alt={metadata.title}
					width="400"
				/>
			</div>
			<div class="right_column">
				<p>
					<strong>Title:</strong>
					{metadata.title}
				</p>
				<p>
					<strong>Artist:</strong>
					{metadata.artistDisplayName}, {metadata.artistDisplayBio}
				</p>
				<p>
					<strong>Date:</strong>
					{metadata.objectDate}
				</p>
				<p>
					<strong>Medium:</strong>
					{metadata.medium}
				</p>
				<p>
					<strong
						><a
							href={metadata.objectWikidata_URL}
							target="_blank"
							rel="noreferrer">Object Wiki</a
						></strong
					>
				</p>
				<p>
					<strong
						><a
							href={metadata.artistWikidata_URL}
							target="_blank"
							rel="noreferrer">Artist Wiki</a
						></strong
					>
				</p>
			</div>
		</div>
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
