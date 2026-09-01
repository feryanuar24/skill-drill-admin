<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  export let title = "";
</script>

<div class="min-h-screen bg-gray-100 flex">
  <Sidebar />
  <div class="flex-1 md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
    <main class="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
      {#if title}
        <div class="mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>
      {/if}
      <slot />
    </main>
  </div>
</div>
