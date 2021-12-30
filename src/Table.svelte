<script>
	import Tabulator from 'tabulator-tables';
	import 'tabulator-tables/dist/css/tabulator.min.css';
	import { format } from 'sql-formatter';
	import { getContext } from 'svelte';
	import { database, query, queryResult } from './stores/databaseStore.js';
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
	queryResult.subscribe(async (dataPromise) => {
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
							column.headerFilter = true;
						});
						return definitions;
					},
					groupStartOpen: false,
					rowClick: function (e, row) {
						showPopup(open, $database, row.getData());
					},
					pagination: 'local',
					paginationSize: 20,
					paginationSizeSelector: [5, 10, 20, 50, 100],
				});
				const actualColumns = Object.getOwnPropertyNames(
					table.columnManager.columnsByField
				);
				for (const column of actualColumns) {
					if (hiddenColumns.includes(column)) {
						table.hideColumn(column);
					}
				}
			}
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

<h2>{$database}</h2>
Group By
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
<br /><br />
<strong>Query: </strong>
<pre>{$query ? format($query['query']) : ''}</pre>

<style>
</style>
