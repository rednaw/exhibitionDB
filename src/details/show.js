import ExhibitionDB from './ExhibitionDB.svelte'
import Metropolitan from './Metropolitan.svelte'
import Artic from './Artic.svelte'
import Artwork from './Artwork.svelte'

export function showPopup(open, title, data) {
	switch (title) {
		case 'ExhibitionDB':
			open(ExhibitionDB, { object: data })
			break
		case 'Metropolitan':
			open(Metropolitan, { object: data })
			break
		case 'Artic':
			open(Artic, { object: data })
			break
		case 'Artic2':
			open(Artwork, { object: data })
			break
		case 'Rijksmuseum':
			open(Artwork, { object: data })
			break
	}
}