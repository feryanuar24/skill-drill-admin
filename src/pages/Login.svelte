<script lang="ts">
  import apiClient, { type LoginResponse } from "../api/client";
  import { login } from "../stores/auth";
  import { replace, link } from "svelte-spa-router";

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
  class="min-h-screen bg-linear-to-br from-blue-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4"
>
  <div
    class="bg-white rounded-2xl shadow-slate-800 w-full max-w-md p-8 sm:p-10"
  >
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-2">
        <span class="text-3xl">🎯</span>
        <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
      </div>
      <p class="text-sm text-gray-500">
        Sign in to manage your Skill Drill portal
      </p>
    </div>

    {#if error}
      <div
        class="mb-6 p-4 bg-red-600-light border border-red-200 text-red-600 text-sm rounded-xl flex items-center space-x-2"
      >
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="space-y-5">
      <div>
        <label
          for="email"
          class="block text-sm font-medium text-gray-700 mb-1.5"
          >Email Address</label
        >
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="admin@example.com"
          required
          on:keypress={handleKeyPress}
          class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1.5">Password</label
        >
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          on:keypress={handleKeyPress}
          class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-600-hover disabled:opacity-60 text-white font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {#if loading}
          <svg
            class="animate-spin h-5 w-5 text-white"
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
        {/if}
      </button>

      <div class="text-center pt-2">
        <a
          href="/"
          use:link
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          &larr; Back to Home
        </a>
      </div>
    </form>
  </div>
</div>
