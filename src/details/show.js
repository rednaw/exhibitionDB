import ExhibitionDB from './ExhibitionDB.svelte'
import Artic from './Artic.svelte'
import Artwork from './Artwork.svelte'

export function showPopup(open, title, data) {
	switch (title) {
		case 'ExhibitionDB':
			open(ExhibitionDB, { object: data })
			break
		case 'Artic':
			open(Artic, { object: data })
			break
		case 'Metropolitan':
			open(Artwork, {
				object: data,
				metadata: () => metropolitanMetadata(data)
			})
			break
		case 'Artic2':
			open(Artwork, {
				object: data,
				metadata: () => defaultMetadata(data)
			})
			break
		case 'Rijksmuseum':
			open(Artwork, {
				object: data,
				metadata: () => defaultMetadata(data)
			})
			break
	}
}

async function defaultMetadata(object) {
	return await object
}

async function metropolitanMetadata(object) {
	let result =
		'https://collectionapi.metmuseum.org/public/collection/v1/objects/' +
		object.id
	result = await fetch(result)
	result = await result.json()
	result['image_url'] = result['primaryImageSmall']
	return result
};
