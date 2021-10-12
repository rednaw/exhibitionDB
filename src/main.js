import App from './App.svelte'
import Table from './Table.svelte'
import Gallery from './Gallery.svelte'

const menuDiv = document.querySelector('#menu')
menuDiv &&
  new App({
    target: menuDiv
  })

const viewDiv = document.querySelector('#view')
viewDiv &&
  new Table({
    target: viewDiv
  })

const galleryDiv = document.querySelector('#gallery')
galleryDiv &&
  new Gallery({
    target: galleryDiv
  })
