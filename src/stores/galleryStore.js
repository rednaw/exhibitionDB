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

export function addItem(item) {
	gallery.update($gallery => {
		$gallery.unshift(item)
		return $gallery
	})
}

export function removeItem(item) {
	gallery.update($gallery => {
		$gallery = $gallery.filter(i => {
			return (JSON.stringify(i) !== JSON.stringify(item))
		})
		return $gallery
	})
}
