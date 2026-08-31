<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "../stores/router";
  import { isLoggedIn, initializeAuth } from "../stores/auth";

  onMount(() => {
    initializeAuth();
  });
</script>

<main>
  {#if $isLoggedIn}
    <div>Dashboard</div>
  {:else}
    <div>Redirecting to login...</div>
  {/if}
</main>
