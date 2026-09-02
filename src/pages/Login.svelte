<script lang="ts">
  import apiClient, { type LoginResponse } from "../api/client";
  import { login } from "../stores/auth";
  import { replace, link } from "../stores/routerCompat";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleLogin() {
    error = "";
    loading = true;

    try {
      const response: LoginResponse = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      login(response.token, response.user);
      replace("/dashboard");
    } catch (err: any) {
      error =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }
</script>

<div
  class="min-h-screen bg-[#fdf5cb] flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden selection:bg-black selection:text-[#fde047]"
>
  <!-- Background Geometric Accent Dots -->
  <div
    class="absolute inset-0 pointer-events-none opacity-20"
    style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 24px 24px;"
  ></div>

  <!-- Ambient Floating Background Shapes -->
  <div
    class="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-black bg-[#f43f5e] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-4 border-black bg-[#38bdf8] z-0 opacity-30 blur-xs"
  ></div>
  <div
    class="absolute top-1/4 -right-8 w-28 h-28 bg-[#a78bfa] border-4 border-black rounded-2xl rotate-12 opacity-35"
  ></div>

  <!-- Login Card Container -->
  <div class="relative z-10 w-full max-w-md">
    <!-- Main Neo-brutalist Card -->
    <div
      class="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 sm:p-8 relative"
    >
      <!-- Header Badge / Brand -->
      <div class="mb-6 flex flex-col items-center text-center">
        <div
          class="w-14 h-14 bg-[#fde047] border-3 sm:border-4 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-2xl mb-3 transform -rotate-3 hover:rotate-0 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.2"
            stroke="currentColor"
            class="w-7 h-7 text-black"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
            />
          </svg>
        </div>
        <div
          class="inline-block bg-black text-white px-2.5 py-0.5 rounded border border-black text-[11px] font-black uppercase tracking-wider mb-1"
        >
          Admin Portal
        </div>
        <h1
          class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black"
        >
          Portal Login
        </h1>
        <p class="text-xs sm:text-sm font-semibold text-black/70 mt-1">
          Sign in to access and manage Skill Drill
        </p>
      </div>

      {#if error}
        <div
          class="mb-6 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
        >
          <span class="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      {/if}

      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="admin@example.com"
            required
            on:keypress={handleKeyPress}
            class="w-full px-4 py-3 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            required
            on:keypress={handleKeyPress}
            class="w-full px-4 py-3 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full mt-2 py-3.5 px-4 bg-[#fde047] hover:bg-[#facc15] disabled:opacity-60 border-3 border-black text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {#if loading}
            <svg
              class="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Signing in...</span>
          {:else}
            <span>Sign In</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          {/if}
        </button>

        <div class="text-center pt-3">
          <a
            href="/"
            use:link
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
          >
            &larr; Back to Landing Page
          </a>
        </div>
      </form>
    </div>
  </div>
</div>
