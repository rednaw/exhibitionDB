import ExhibitionDB from './ExhibitionDB.svelte'
import Dialog from './Dialog.svelte'

export function showPopup(open, title, data) {
	switch (title) {
		case 'ExhibitionDB':
			open(ExhibitionDB, { object: data })
			break
		case 'Artic':
			open(Dialog, {
				object: data,
				metadata: () => articMetadata(data)
			})
			break
		case 'Metropolitan':
			open(Dialog, {
				object: data,
				metadata: () => metropolitanMetadata(data)
			})
			break
		case 'Artic2':
			open(Dialog, {
				object: data,
				metadata: () => defaultMetadata(data)
			})
			break
		case 'Rijksmuseum':
			open(Dialog, {
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

async function articMetadata(object) {
	let result = 'https://api.artic.edu/api/v1/exhibitions/' + object.id
	result = await fetch(result)
	result = await result.json()
	result = result['data']
	result['image_url'] = object['image_url']
	return result
};
