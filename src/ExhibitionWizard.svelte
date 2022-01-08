<script>
  import Wizard from './wizard/Wizard.svelte';
  import WizardPage from './wizard/WizardPage.svelte';
</script>

<main>
  <Wizard>
    <WizardPage>
      <h1>Page 1</h1>
    </WizardPage>
    <WizardPage>
      <h1>Page 2</h1>
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
