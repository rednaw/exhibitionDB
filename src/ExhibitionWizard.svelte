<script>
  import Select from 'svelte-select';
  import Wizard from './wizard/Wizard.svelte';
  import WizardPage from './wizard/WizardPage.svelte';
  import { runQuery } from './stores/databaseStore.js';

  async function artists(filterText) {
    return await runQuery(
      'ExhibitionDB',
      `select ID_Artisti as id, Nome || ' ' || Cognome as name from Artisti where name like '%${filterText}%' limit 1000`
    );
  }

  // async function exhibitions(filterText) {
  //   return await runQuery(
  //     'ExhibitionDB',
  //     `select ID_Artisti as id, Nome || ' ' || Cognome as name from Artisti where name like '%${filterText}%' limit 1000`
  //   );
  // }

  let selectedArtist;
  function artistSelected(event) {
    selectedArtist = event.detail;
    console.log(selectedArtist);
  }
</script>

<main>
  <Wizard>
    <WizardPage>
      <h1>Choose artist</h1>
      <div style="width: 25em;">
        <Select
          loadOptions={artists}
          optionIdentifier="id"
          labelIdentifier="name"
          on:select={artistSelected}
        />
      </div>
      <br />
    </WizardPage>
    <WizardPage>
      <h1>Choose exhibition</h1>
    </WizardPage>
    <WizardPage>
      <h1>Page 3</h1>
    </WizardPage>
    <WizardPage>
      <h1>Page 4</h1>
    </WizardPage>
  </Wizard>
</main>

<style>
</style>
