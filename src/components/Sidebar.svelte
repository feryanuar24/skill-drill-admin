<script lang="ts">
  import { currentUser, logout } from "../stores/auth";
  import { location, link, replace } from "../stores/routerCompat";

  let showMobileMenu = false;

  function handleLogout() {
    logout();
    replace("/login");
  }

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      iconType: "dashboard",
    },
    {
      path: "/users",
      label: "Users",
      iconType: "users",
    },
    {
      path: "/topics",
      label: "Topics",
      iconType: "topics",
    },
    {
      path: "/generate-questions",
      label: "AI Generator",
      iconType: "ai",
    },
  ];
</script>

<aside
  class="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r-4 border-black flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 {!showMobileMenu
    ? '-translate-x-full md:translate-x-0'
    : 'translate-x-0'}"
>
  <!-- Brand Logo -->
  <div
    class="h-20 flex items-center justify-between px-5 border-b-4 border-black bg-[#fdf5cb]"
  >
    <a href="/" use:link class="flex items-center space-x-2.5">
      <div
        class="w-10 h-10 bg-[#fde047] border-3 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.2"
          stroke="currentColor"
          class="w-5 h-5 text-black"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      </div>
      <div>
        <span class="font-black text-base tracking-tight text-black uppercase"
          >Skill Drill</span
        >
        <span
          class="block text-[10px] font-black uppercase bg-black text-white px-1.5 py-0.2 rounded border border-black w-fit"
          >Admin</span
        >
      </div>
    </a>
    <button
      class="md:hidden text-black font-black bg-white border-2 border-black p-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
      on:click={() => (showMobileMenu = false)}
      aria-label="Close Sidebar"
    >
      ✕
    </button>
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto">
    {#each navItems as item}
      <a
        href={item.path}
        use:link
        on:click={() => (showMobileMenu = false)}
        class="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 {$location ===
        item.path
          ? 'bg-[#fde047] text-black border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] translate-x-0.5'
          : 'bg-transparent text-black/80 hover:bg-[#fef9c3] hover:text-black border-3 border-transparent hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]'}"
      >
        <span class="shrink-0">
          {#if item.iconType === "dashboard"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 21h16.5M6 9v7.5M10.5 6v10.5M15 12v4.5M19.5 3v13.5"
              />
            </svg>
          {:else if item.iconType === "users"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          {:else if item.iconType === "topics"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          {:else if item.iconType === "ai"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          {/if}
        </span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- User & Logout Section -->
  <div class="p-4 border-t-4 border-black bg-[#fdf5cb] space-y-3">
    <div
      class="bg-white border-3 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]"
    >
      <span
        class="text-[10px] text-black/60 font-black uppercase tracking-wider block"
        >Signed in as</span
      >
      <div class="flex items-center space-x-2 mt-0.5">
        <span
          class="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-pulse"
        ></span>
        <span class="text-xs font-black text-black uppercase truncate"
          >{$currentUser?.username || "Admin"}</span
        >
      </div>
    </div>
    <button
      on:click={handleLogout}
      class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.2"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
        />
      </svg>
      <span>Logout</span>
    </button>
  </div>
</aside>

<!-- Mobile Overlay Backdrop -->
{#if showMobileMenu}
  <div
    class="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
    on:click={() => (showMobileMenu = false)}
    role="presentation"
  ></div>
{/if}

<!-- Mobile Topbar Header -->
<div
  class="md:hidden fixed top-0 left-0 right-0 z-20 h-16 bg-[#fde047] border-b-4 border-black text-black flex items-center justify-between px-4 shadow-[0px_4px_0px_rgba(0,0,0,1)]"
>
  <button
    on:click={() => (showMobileMenu = true)}
    class="p-2 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
    aria-label="Open Sidebar"
  >
    <svg
      class="w-5 h-5 text-black"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
  <div class="flex items-center space-x-2">
    <div
      class="w-7 h-7 bg-[#fde047] border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.2"
        stroke="currentColor"
        class="w-4 h-4 text-black"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    </div>
    <span class="font-black text-sm uppercase tracking-tight">Skill Drill</span>
  </div>
  <button
    on:click={handleLogout}
    class="text-xs font-black uppercase tracking-wider bg-[#f43f5e] text-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
  >
    Logout
  </button>
</div>
