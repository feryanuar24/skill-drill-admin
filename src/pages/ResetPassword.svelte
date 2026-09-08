<script lang="ts">
  import { onMount } from "svelte";
  import apiClient from "../api/client";
  import { link } from "../stores/routerCompat";

  let token = "";
  let password = "";
  let confirmPassword = "";

  let loading = false;
  let success = false;
  let error = "";
  let fieldErrors: Record<string, string[]> = {};

  // Password rules validation
  $: hasMinLength = password.length >= 8;
  $: hasUpper = /[A-Z]/.test(password);
  $: hasLower = /[a-z]/.test(password);
  $: hasNumber = /[0-9]/.test(password);
  $: hasSymbol = /[^A-Za-z0-9]/.test(password);
  $: passwordsMatch = password.length > 0 && password === confirmPassword;
  $: isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl && tokenFromUrl.trim()) {
      token = tokenFromUrl.trim();
    }
  });

  async function handleResetPassword() {
    error = "";
    fieldErrors = {};

    if (!token.trim()) {
      error = "Please provide the reset token.";
      return;
    }

    if (!isPasswordValid) {
      error =
        "Password must be at least 8 characters and contain uppercase, lowercase, numbers, and symbols.";
      return;
    }

    if (password !== confirmPassword) {
      error = "Passwords do not match.";
      return;
    }

    loading = true;

    try {
      await apiClient.resetPassword({
        token: token.trim(),
        password,
      });
      success = true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        fieldErrors = err.response.data.errors;
        error =
          err.response?.data?.message ||
          "Password reset failed. Please check the requirements.";
      } else {
        error =
          err.response?.data?.message ||
          "Failed to reset password. The token may be invalid or expired.";
      }
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleResetPassword();
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
    class="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-black bg-[#a78bfa] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-4 border-black bg-[#fb923c] z-0 opacity-30 blur-xs"
  ></div>
  <div
    class="absolute top-1/4 -right-8 w-28 h-28 bg-[#86efac] border-4 border-black rounded-2xl rotate-12 opacity-35"
  ></div>

  <!-- Reset Password Card Container -->
  <div class="relative z-10 w-full max-w-lg">
    <div
      class="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 sm:p-8 relative"
    >
      {#if success}
        <!-- Success State View -->
        <div class="text-center py-4">
          <div
            class="w-16 h-16 bg-[#86efac] border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-4 transform -rotate-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-9 h-9 text-black"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <div
            class="inline-block bg-black text-white px-2.5 py-0.5 rounded border border-black text-[11px] font-black uppercase tracking-wider mb-2"
          >
            Password Reset
          </div>

          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2"
          >
            Password Updated!
          </h1>

          <p
            class="text-xs sm:text-sm font-semibold text-black/70 mb-6 max-w-sm mx-auto"
          >
            Your password has been successfully reset. You can now sign in with
            your new credentials.
          </p>

          <a
            href="/login"
            use:link
            class="w-full py-3.5 px-4 bg-[#fde047] hover:bg-[#facc15] border-3 border-black text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
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
          </a>
        </div>
      {:else}
        <!-- Form View -->
        <div class="mb-6 flex flex-col items-center text-center">
          <div
            class="w-14 h-14 bg-[#a78bfa] border-3 sm:border-4 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-2xl mb-3 transform rotate-3 hover:rotate-0 transition-transform"
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <div
            class="inline-block bg-black text-white px-2.5 py-0.5 rounded border border-black text-[11px] font-black uppercase tracking-wider mb-1"
          >
            Security
          </div>
          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black"
          >
            Reset Password
          </h1>
          <p class="text-xs sm:text-sm font-semibold text-black/70 mt-1">
            Set a new secure password for your account
          </p>
        </div>

        {#if error}
          <div
            class="mb-5 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-start space-x-2.5"
          >
            <span class="text-lg flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </span>
            <div class="flex-1">
              <p>{error}</p>
              {#if Object.keys(fieldErrors).length > 0}
                <ul
                  class="mt-1 list-disc list-inside text-xs font-semibold text-rose-800 space-y-0.5"
                >
                  {#each Object.entries(fieldErrors) as [field, messages]}
                    {#each messages as msg}
                      <li>{msg}</li>
                    {/each}
                  {/each}
                </ul>
              {/if}
            </div>
          </div>
        {/if}

        <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
          <div>
            <label
              for="reset-token"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Reset Token
            </label>
            <input
              id="reset-token"
              type="text"
              bind:value={token}
              placeholder="Paste your reset token"
              required
              class="w-full px-4 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-mono font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          <div>
            <label
              for="reset-password"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              New Password
            </label>
            <input
              id="reset-password"
              type="password"
              bind:value={password}
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {fieldErrors.password
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
            {#if fieldErrors.password}
              <p class="mt-1 text-xs font-bold text-rose-600">
                {fieldErrors.password[0]}
              </p>
            {/if}

            <!-- Password Requirements Checklist -->
            {#if password.length > 0}
              <div
                class="mt-2.5 p-2.5 bg-[#fdf5cb] border-2 border-black rounded-lg text-[11px] font-bold space-y-1"
              >
                <div
                  class="text-[10px] uppercase font-black tracking-wider text-black/70 mb-1"
                >
                  Password Requirements:
                </div>
                <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div
                    class="flex items-center gap-1.5 {hasMinLength
                      ? 'text-emerald-700'
                      : 'text-black/50'}"
                  >
                    <span>{hasMinLength ? "✓" : "○"}</span>
                    <span>Min 8 characters</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 {hasUpper
                      ? 'text-emerald-700'
                      : 'text-black/50'}"
                  >
                    <span>{hasUpper ? "✓" : "○"}</span>
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 {hasLower
                      ? 'text-emerald-700'
                      : 'text-black/50'}"
                  >
                    <span>{hasLower ? "✓" : "○"}</span>
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 {hasNumber
                      ? 'text-emerald-700'
                      : 'text-black/50'}"
                  >
                    <span>{hasNumber ? "✓" : "○"}</span>
                    <span>Number (0-9)</span>
                  </div>
                  <div
                    class="flex items-center gap-1.5 {hasSymbol
                      ? 'text-emerald-700'
                      : 'text-black/50'} col-span-2"
                  >
                    <span>{hasSymbol ? "✓" : "○"}</span>
                    <span>Special character (!@#$...)</span>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <div>
            <label
              for="reset-confirm-password"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Confirm New Password
            </label>
            <input
              id="reset-confirm-password"
              type="password"
              bind:value={confirmPassword}
              placeholder="••••••••"
              required
              on:keypress={handleKeyPress}
              class="w-full px-4 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
            />
            {#if confirmPassword.length > 0 && !passwordsMatch}
              <p class="mt-1 text-xs font-bold text-rose-600">
                Passwords do not match
              </p>
            {/if}
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full mt-2 py-3.5 px-4 bg-[#a78bfa] hover:bg-[#9333ea] disabled:opacity-60 border-3 border-black text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
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
              <span>Updating Password...</span>
            {:else}
              <span>Reset Password</span>
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

          <!-- Navigation Links -->
          <div class="pt-3 flex flex-col items-center gap-2.5">
            <div class="text-xs font-bold text-black/80">
              Remember your password?
              <a
                href="/login"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Sign In
              </a>
            </div>

            <div class="text-xs font-bold text-black/60">
              Need a new token?
              <a
                href="/forgot-password"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Request Again
              </a>
            </div>

            <a
              href="/"
              use:link
              class="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
            >
              &larr; Back to Landing Page
            </a>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>
