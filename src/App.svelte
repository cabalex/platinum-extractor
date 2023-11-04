<script lang="ts">
    import FileHandler from './lib/FileHandler';
    import { addToast } from './components/Toasts/ToastStore';
    import Toasts from './components/Toasts/Toasts.svelte';
    import Sidebar from './components/Sidebar/Sidebar.svelte';
    import Main from './components/Main/Main.svelte';
  
    addToast({
      title: '👋 Welcome!',
      message: 'Platinum Extractor is currently in alpha, so please report any bugs you find.\nHappy extracting!',
      type: 'info',
      timeout: 5000,
      dismissable: false
    });

    const fileHandler = new FileHandler();
</script>

<Sidebar fileHandler={fileHandler} />
<Main fileHandler={fileHandler} />
<Toasts />