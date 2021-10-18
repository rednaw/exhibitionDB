import ExhibitionDB from './ExhibitionDB.svelte'
import Dialog from './Dialog.svelte'

export function showPopup(open, depot, data) {
	switch (depot) {
		case 'Gallery':
			open(Dialog, {
				object: data,
				metadata: () => defaultMetadata(data)
			}, {}, {
				onClosed: () => {
					console.log('modal window closed')
				}
			})
			break
		case 'ExhibitionDB':
			open(ExhibitionDB, { object: data })
			break
		case 'Artic':
			open(Dialog, {
				object: data,
				metadata: () => articMetadata('exhibitions', data)
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
				metadata: () => articMetadata('artworks', data)
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
	return { core: object, extended: {} }
}

async function metropolitanMetadata(object) {
	let metadata = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${object.id}`
	metadata = await fetch(metadata)
	metadata = await metadata.json()

	object['image_url'] = metadata['primaryImageSmall']
	return { core: object, extended: metadata }
}

async function articMetadata(table, object) {
	let metadata = `https://api.artic.edu/api/v1/${table}/${object.id}`
	metadata = await fetch(metadata)
	metadata = await metadata.json()
	metadata = metadata['data']

	object['image_url'] = `https://lakeimagesweb.artic.edu/iiif/2/${object.image_id}/full/843,/0/default.jpg`
	return { core: object, extended: metadata }
}
