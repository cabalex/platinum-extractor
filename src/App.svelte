<script lang="ts">
  import Files from './lib/Files/Files.svelte';
  import FileHandler from './FileHandler';
  import { addToast } from './lib/Toasts/ToastStore';
  import Toasts from './lib/Toasts/Toasts.svelte';
  import Main from './lib/Main/Main.svelte';

  addToast({
    title: '👋 Welcome!',
    message: 'Platinum Extractor is currently in alpha, so please report any bugs you find.\nHappy extracting!',
    type: 'info',
    timeout: 5000,
    dismissable: false
  });

  let fileHandler = new FileHandler();
</script>

<div>
  <Files fileHandler={fileHandler} />
</div>
<Main />

<Toasts />