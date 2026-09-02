<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  export let title = "";
</script>

<div
  class="min-h-screen bg-[#fdf5cb] flex font-sans relative selection:bg-black selection:text-[#fde047]"
>
  <!-- Background Geometric Accent Dots -->
  <div
    class="absolute inset-0 pointer-events-none opacity-20"
    style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 24px 24px;"
  ></div>

  <!-- Sidebar -->
  <Sidebar />

  <!-- Main Content Area -->
  <div
    class="flex-1 md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0 relative z-10"
  >
    <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
      {#if title}
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <h1
              class="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight"
            >
              {title}
            </h1>
          </div>
        </div>
      {/if}
      <slot />
    </main>
  </div>
</div>
