<script>
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator.min.css';
  import Select from 'svelte-select';
  import { _ } from './services/i18n';
  import { runQuery } from './stores/databaseStore.js';

  let exhibitionList;
  let exhibitionView;

  async function artists(filterText) {
    if (filterText.length >= 3) {
      return await runQuery(
        'ExhibitionDB',
        `select 
        a.ID_Artisti as id, 
        a.Nome || ' ' || a.Cognome as name
      from 
        Artisti a
      where 
        name like '%${filterText}%' and
        exists (select * from Artisti_esposti ae where ae.ID_Artista = a.ID_Artisti)
      limit 10`
      );
    } else {
      return await new Promise((resolve) => {
        resolve([]);
      });
    }
  }

  async function exhibitions(artistID) {
    return await runQuery(
      'ExhibitionDB',
      `select distinct
        e.ID_Esposizioni as id,
        e.Anno_Esposizione as Year,
        e.Titolo_Esposizione as Title,
        u.Luogo_Espositivo as Place,
        u.Città_visione as City,
        u.Nazione as Country
       from
        Esposizioni e,
        Artisti_esposti ae,
        Ubicazioni u
       where
        e.ID_Esposizioni = ae.ID_Esposizione and
        e.ID_Ubicazioni = u.ID_Ubicazioni and
        ae.ID_Artista = ${artistID}`
    );
  }

  async function exhibitionDetails(exhibitionID, artistID) {
    return await runQuery(
      'ExhibitionDB',
      `select
        o.Anno_Opera as Year,
        o.Titolo_Opera as Title,
        o.Dimensioni as Dimensions,
        o.Tecnica as Type
      from 
        Opere_no_img o, 
        Opere_Esposte oe, 
        Esposizioni e 
      where 
        e.ID_Esposizioni = ${exhibitionID} and 
        o.ID_Artisti = ${artistID} and 
        oe.ID_Esposizione = e.ID_Esposizioni and 
        oe.ID_Opera = o.ID_Opere;`
    );
  }

  function artistSelected(event) {
    const artistID = event.detail.id;
    exhibitions(artistID).then((exhibitions) => {
      const table = new Tabulator(exhibitionList, {
        data: exhibitions,
        layout: 'fitColumns',
        autoColumns: true,
        autoColumnsDefinitions: [
          { field: 'id', visible: false },
          { field: 'Year', width: '5em' },
        ],
      });
      table.on('rowClick', function (e, row) {
        exhibitionSelected(row.getData().id, artistID);
      });
    });
  }

  function exhibitionSelected(exhibitionID, artistID) {
    exhibitionDetails(exhibitionID, artistID).then((details) => {
      new Tabulator(exhibitionView, {
        data: details,
        layout: 'fitColumns',
        autoColumns: true,
        autoColumnsDefinitions: [{ field: 'Year', width: '5em' }],
      });
    });
  }
</script>

<main>
  <h4>{$_('table.artist')}</h4>
  <div style="width: 25em;">
    <Select
      loadOptions={artists}
      optionIdentifier="id"
      labelIdentifier="name"
      placeholder="{$_('table.artist_name')}..."
      on:select={artistSelected}
    />
  </div>
  <br />
  <h4>{$_('table.exhibitions')}</h4>
  <div bind:this={exhibitionList} />
  <br />
  <h4>{$_('table.artworks')}</h4>
  <div bind:this={exhibitionView} />
</main>

<style>
</style>
