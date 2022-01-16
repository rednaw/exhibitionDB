<script>
  import { createEventDispatcher } from 'svelte';

  export let value = 'en';

  const dispatch = createEventDispatcher();

  function handleLocaleChange(event) {
    event.preventDefault();

    dispatch('locale-changed', event.target.value);
  }
</script>

<div class="locale-selector">
  <div class="select">
    <select {value} on:change={handleLocaleChange}>
      <option value="en">English</option>
      <option value="it">Italiano</option>
    </select>
  </div>
</div>

<style>
  .locale-selector {
    display: flex;
    justify-content: center;
  }

  .select {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
</style>
