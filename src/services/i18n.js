import { derived } from 'svelte/store'
import { dictionary, locale, _ } from 'svelte-i18n'

let cachedLocale

async function setupI18n(_locale) {
  const message_file = `static/lang/${_locale}.json`
  const response = await fetch(message_file)
  if (!response.ok) {
    _locale = 'en'
  }
  const messages = await response.json()
  dictionary.set({ [_locale]: messages })
  cachedLocale = _locale
  locale.set(_locale)
}

const isLocaleLoaded = derived(locale, $locale => typeof $locale === 'string')

export { _, locale, setupI18n, isLocaleLoaded }
