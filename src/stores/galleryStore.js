import { asyncable } from 'svelte-asyncable'
import localforage_js from 'localforage'

const key = 'gallery'

export const gallery =
	asyncable(
		async () => {
			let result = []
			const keys = await localforage_js.keys()
			if (keys.includes(key)) {
				const value = await localforage_js.getItem(key)
				if (value.length > 0) {
					result = value
				}
			}
			return result
		},
		async ($newValue, $prevValue) => {
			if ($newValue != $prevValue) {
				await localforage_js.setItem(key, $newValue)
			}
		},
		[]
	)

export function addImage(url) {
	gallery.update($gallery => {
		$gallery.unshift(url)
		return $gallery
	})
}

export function removeImage(url) {
	gallery.update($gallery => {
		$gallery = $gallery.filter(item => {
			return (item !== url)
		})
		return $gallery
	})
}
