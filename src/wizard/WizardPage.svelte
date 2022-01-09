<script>
  import { fly } from 'svelte/transition';
  import { getContext } from 'svelte';

  const wizard = getContext('wizard');

  const id = wizard.addPage();
  let isCurrent = id === 0;

  wizard.onChange((page) => {
    isCurrent = page === id;
  });
</script>

{#if isCurrent}
  <div
    style="position: absolute; top: 0; left: 0;"
    in:fly={{ x: 200, duration: 300 }}
    out:fly={{ x: -200, duration: 300 }}
  >
    <slot />
  </div>
{/if}
