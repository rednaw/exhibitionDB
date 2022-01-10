<script>
  import Table from './Table.svelte';
  import Modal from 'svelte-simple-modal';
  import Gallery from './Gallery.svelte';
  import ExhibitionDB from './ExhibitionDB.svelte';
  import { menuEntries, selectedMenuKey } from './stores/menuStore.js';
</script>

<div class="navbar">
  <a href="./#" on:click={() => selectedMenuKey.set('Gallery')}>Home</a>
  {#each Object.keys($menuEntries) as key}
    <a href="./#" on:click={() => selectedMenuKey.set(key)}>{key}</a>
  {/each}
  <a href="./#" on:click={() => selectedMenuKey.set('ExhibitionDB')}>
    ExhibitionDB
  </a>
</div>
<div class="main">
  <Modal>
    {#if $selectedMenuKey == 'Gallery'}
      <Gallery />
    {:else if $selectedMenuKey == 'ExhibitionDB'}
      <ExhibitionDB />
    {:else}
      <Table />
    {/if}
  </Modal>
</div>

<style>
  .navbar {
    z-index: 999;
    overflow: hidden;
    background-color: #333;
    position: fixed;
    top: 0;
    width: 100%;
  }

  .navbar a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  .navbar a:hover {
    background: #ddd;
    color: black;
  }

  .main {
    padding-top: 50px;
  }
</style>
