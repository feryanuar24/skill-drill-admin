<script lang="ts">
  import { currentUser, logout } from "../stores/auth";
  import { location, link, replace } from "svelte-spa-router";

  let showMobileMenu = false;

  function handleLogout() {
    logout();
    replace("/login");
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/topics", label: "Topics", icon: "📚" },
    { path: "/generate-questions", label: "Generate Questions", icon: "❓" },
  ];
</script>

<aside
  class="fixed top-0 left-0 z-40 w-64 h-screen bg-primary text-white flex flex-col shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 {!showMobileMenu
    ? '-translate-x-full md:translate-x-0'
    : 'translate-x-0'}"
>
  <!-- Brand Logo -->
  <div class="h-16 flex items-center justify-between px-6 border-b border-white/10">
    <div class="flex items-center space-x-3">
      <span class="text-2xl">🎯</span>
      <h1 class="text-xl font-bold tracking-wide">Skill Drill</h1>
    </div>
    <button
      class="md:hidden text-white/80 hover:text-white p-1"
      on:click={() => (showMobileMenu = false)}
      aria-label="Close Sidebar"
    >
      ✕
    </button>
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
    {#each navItems as item}
      <a
        href={item.path}
        use:link
        on:click={() => (showMobileMenu = false)}
        class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 {$location ===
        item.path
          ? 'bg-white/20 text-white font-semibold shadow-sm'
          : 'text-white/80 hover:bg-white/10 hover:text-white'}"
      >
        <span class="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- User & Logout Section -->
  <div class="p-4 border-t border-white/10 bg-black/10">
    <div class="flex items-center justify-between mb-3 px-2">
      <div class="flex flex-col min-w-0">
        <span class="text-xs text-white/60 font-medium uppercase tracking-wider">Signed in as</span>
        <span class="text-sm font-semibold truncate">{$currentUser?.username || "Admin"}</span>
      </div>
    </div>
    <button
      on:click={handleLogout}
      class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-red-500/80 text-white text-sm font-medium rounded-lg border border-white/20 transition duration-150 cursor-pointer"
    >
      <span>🚪</span>
      <span>Logout</span>
    </button>
  </div>
</aside>

<!-- Mobile Overlay Backdrop -->
{#if showMobileMenu}
  <div
    class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
    on:click={() => (showMobileMenu = false)}
    role="presentation"
  ></div>
{/if}

<!-- Mobile Topbar Header -->
<div
  class="md:hidden fixed top-0 left-0 right-0 z-20 h-16 bg-primary text-white flex items-center justify-between px-4 shadow-md"
>
  <button
    on:click={() => (showMobileMenu = true)}
    class="p-2 rounded-md hover:bg-white/10 focus:outline-none cursor-pointer"
    aria-label="Open Sidebar"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
  <div class="flex items-center space-x-2">
    <span>🎯</span>
    <span class="font-bold">Skill Drill Admin</span>
  </div>
  <button
    on:click={handleLogout}
    class="text-xs bg-white/10 hover:bg-red-500/80 px-3 py-1.5 rounded border border-white/20 cursor-pointer"
  >
    Logout
  </button>
</div>
