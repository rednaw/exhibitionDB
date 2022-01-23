import Exhibition from './Exhibition.svelte'
import Artwork from './Artwork.svelte'

export function showPopup(open, selectedMenuKey, data) {
  switch (selectedMenuKey) {
    case 'menu.gallery':
      open(Artwork, {
        object: data,
        metadata: () => defaultMetadata(data)
      })
      break
    case 'menu.artic_exhibitions':
      open(Exhibition, {
        object: data,
        metadata: () => articExhibitionsMetadata(data)
      })
      break
    case 'menu.metropolitan_artworks':
      open(Artwork, {
        object: data,
        metadata: () => metropolitanMetadata(data)
      })
      break
    case 'menu.artic_artworks':
      open(Artwork, {
        object: data,
        metadata: () => articArtworksMetadata(data)
      })
      break
    case 'menu.rijksmuseum_artworks':
      open(Artwork, {
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

async function articArtworksMetadata(object) {
  let metadata = `https://api.artic.edu/api/v1/artworks/${object.id}`
  metadata = await fetch(metadata)
  metadata = await metadata.json()
  metadata = metadata['data']

  object['image_url'] = `https://lakeimagesweb.artic.edu/iiif/2/${metadata.image_id}/full/843,/0/default.jpg`
  return { core: object, extended: metadata }
}

async function articExhibitionsMetadata(object) {
  let metadata = `https://api.artic.edu/api/v1/exhibitions/${object.id}`
  metadata = await fetch(metadata)
  metadata = await metadata.json()
  metadata = metadata['data']

  if (object['image'] == 'yes') {
    object['image_url'] = `https://lakeimagesweb.artic.edu/iiif/2/${metadata.image_id}/full/843,/0/default.jpg`
  }
  if (object['catalogue'] == 'yes') {
    object['catalogue_url'] = `https://www.artic.edu/assets/${metadata['document_ids']}`
  }
  return { core: object, extended: metadata }
}
