import ExhibitionDB from './ExhibitionDB.svelte'
import Metropolitan from './Metropolitan.svelte'
import Artic from './Artic.svelte'
import Rijksmuseum from './Rijksmuseum.svelte'

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
		case 'Rijksmuseum':
			open(Rijksmuseum, { object: data })
			break
	}
}