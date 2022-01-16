<script>
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator.min.css';
  import { getContext } from 'svelte';
  import { _ } from './services/i18n';
  import { selectedMenuKey, selectedMenuResult } from './stores/menuStore.js';
  import { showPopup } from './details/show.js';

  const hiddenColumns = ['id', 'image_url'];
  const { open } = getContext('simple-modal');

  // GroupBy controls
  let columns = [];
  let groupColumns = [];

  // table view
  let tableComponent;
  let table;

  // table data
  selectedMenuResult.subscribe(async (dataPromise) => {
    dataPromise.then((data) => {
      if (data) {
        columns = Object.keys(data[0]);
        table = new Tabulator(tableComponent, {
          data: data,
          reactiveData: true,
          layout: 'fitDataStretch',
          autoColumns: true,
          autoColumnsDefinitions: function (definitions) {
            definitions.forEach((column) => {
              if (hiddenColumns.includes(column.field)) {
                column.visible = false;
              }
              column.headerFilter = true;
            });
            return definitions;
          },
          groupStartOpen: false,
          pagination: 'local',
          paginationSize: 20,
          paginationSizeSelector: [5, 10, 20, 50, 100],
        });
      }
      table.on('rowClick', function (e, row) {
        showPopup(open, $selectedMenuKey, row.getData());
      });
    });
  });

  function handleGroupEvent() {
    if (groupColumns[0] == '' && groupColumns[1] == '') {
      table.setGroupBy('');
    } else if (groupColumns[0] != '' && groupColumns[1] == '') {
      table.setGroupBy(groupColumns[0]);
    } else if (groupColumns[0] == '' && groupColumns[1] != '') {
      table.setGroupBy(groupColumns[1]);
    } else {
      table.setGroupBy(groupColumns);
    }
  }
</script>

<h2>{$selectedMenuKey}</h2>
{$_('table.group_by')}
<select bind:value={groupColumns[0]} on:change={handleGroupEvent}>
  <option value="" />
  {#each columns as column}
    <option value={column}>
      {column}
    </option>
  {/each}
</select>
<select bind:value={groupColumns[1]} on:change={handleGroupEvent}>
  <option value="" />
  {#each columns as column}
    <option value={column}>
      {column}
    </option>
  {/each}
</select>
<br /><br />
<div bind:this={tableComponent} />

<style>
</style>
