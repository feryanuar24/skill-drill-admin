<script lang="ts">
  import { isLoggedIn } from "../stores/auth";
  import { link } from "svelte-spa-router";
</script>

<div
  class="min-h-screen bg-linear-to-br from-blue-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 sm:p-6"
>
  <div
    class="bg-white rounded-2xl shadow-slate-800 w-full max-w-lg p-8 sm:p-10 text-center transform transition-all"
  >
    <div class="flex flex-col items-center mb-6">
      <div
        class="w-16 h-16 bg-blue-600-light rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner"
      >
        🎯
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
        Skill Drill Admin
      </h1>
      <p
        class="text-xs uppercase tracking-widest font-semibold text-blue-600 mt-1"
      >
        Management Portal
      </p>
    </div>

    <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
      Welcome to the Skill Drill administration portal. Manage users, curate
      learning topics, and generate questions using AI.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      {#if $isLoggedIn}
        <a
          href="/dashboard"
          use:link
          class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-600-hover text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-150"
        >
          <span>Go to Dashboard</span>
          <span class="ml-2">📊</span>
        </a>
      {:else}
        <a
          href="/login"
          use:link
          class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-600-hover text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-150"
        >
          <span>Login to Admin Panel</span>
          <span class="ml-2">🔑</span>
        </a>
      {/if}
    </div>
  </div>
</div>
