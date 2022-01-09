<script>
  import { onMount, setContext } from 'svelte';

  export let autoHeight = true;

  let pages = 0;
  let current = 0;
  let containerEl;

  const onChangeListeners = [];
  let onNext = null;
  const wizardContext = {
    addPage: () => pages++,
    onChange: (listener) => {
      onChangeListeners.push(listener);
    },
    onNext: (fn) => {
      onNext = fn;
    },
  };
  setContext('wizard', wizardContext);

  onMount(() => {
    updateHeight();
  });

  function previous() {
    current--;
    triggerOnChange();
    updateHeight();
  }

  function next() {
    if (onNext) onNext();
    current++;
    triggerOnChange();
    onNext = null;
    updateHeight();
  }

  function triggerOnChange() {
    onChangeListeners.forEach((listener) => listener(current));
  }

  function updateHeight() {
    if (autoHeight) {
      containerEl.style.height =
        containerEl.firstElementChild.offsetHeight + 'px';
    }
  }
</script>

<div class="wizard">
  <div style="position: relative;" bind:this={containerEl}>
    <slot />
  </div>

  <button disabled={current === 0} on:click={() => previous()}>Previous</button>
  <button disabled={current === pages - 1} on:click={() => next()}>Next</button>
</div>
