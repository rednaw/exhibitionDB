<script>
  import Toggle from 'svelte-toggle';
  import { gallery, addItem, removeItem } from '../stores/galleryStore.js';
  import { _ } from '../services/i18n';

  export let object;
  export let metadata;

  async function inGallery(metadata) {
    let storedValue = await gallery.get();
    storedValue = storedValue.map(function (element) {
      return JSON.stringify(element);
    });
    const coreMetadata = JSON.stringify(metadata.core);

    return storedValue.includes(coreMetadata);
  }

  function toggle(toggleValue, metadata) {
    if (toggleValue) {
      addItem(metadata.core);
    } else {
      removeItem(metadata.core);
    }
  }
</script>

{#await metadata(object)}
  <p>...loading object metadata</p>
{:then metadata}
  {#await inGallery(metadata)}
    <p>...loading gallery</p>
  {:then inGallery}
    <div>
      <Toggle
        hideLabel="true"
        on:toggle={(e) => toggle(e.detail, metadata)}
        toggled={inGallery}
        on={$_('dialog.toggle_remove')}
        off={$_('dialog.toggle_add')}
      />
    </div>

    <div class="columns">
      <div class="left_column">
        <img
          src={metadata.core.image_url}
          alt={metadata.core.title}
          width="400"
        />
      </div>
      <div class="right_column">
        <p>
          <strong>{$_('table.title')}:</strong>
          {metadata.core.title}
        </p>
        <p>
          <strong>{$_('table.artist')}:</strong>
          {metadata.core.artist}
        </p>
        <p>
          <strong>{$_('table.type')}:</strong>
          {metadata.core.type}
        </p>
        <p>
          <strong>{$_('table.date')}:</strong>
          {metadata.core.date}
        </p>
      </div>
    </div>
    <!-- <pre>{JSON.stringify(metadata, undefined, 2)}</pre> -->
  {/await}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .columns {
    display: flex;
    padding-top: 25px;
  }
  .left_column {
    flex: 70%;
  }
  .right_column {
    flex: 30%;
  }
</style>
