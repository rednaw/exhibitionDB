import App from './App.svelte'

const appDiv = document.querySelector('#app')
appDiv &&
  new App({
    target: appDiv
  })
