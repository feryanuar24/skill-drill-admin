<script lang="ts">
  import { onMount } from "svelte";
  import apiClient from "../api/client";
  import { link } from "../stores/routerCompat";

  let token = "";
  let loading = false;
  let success = false;
  let error = "";
  let attemptedAutoVerify = false;

  onMount(() => {
    // Check if token is present in URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl && tokenFromUrl.trim()) {
      token = tokenFromUrl.trim();
      attemptedAutoVerify = true;
      handleVerify(token);
    }
  });

  async function handleVerify(tokenToVerify?: string) {
    const targetToken = (tokenToVerify || token).trim();
    if (!targetToken) {
      error = "Please enter a valid verification token.";
      return;
    }

    error = "";
    loading = true;

    try {
      await apiClient.verifyEmail(targetToken);
      success = true;
    } catch (err: any) {
      success = false;
      error =
        err.response?.data?.message ||
        "Failed to verify email. The token might be invalid, expired, or already used.";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleVerify();
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
    class="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-black bg-[#38bdf8] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-4 border-black bg-[#fde047] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute top-1/4 -right-8 w-28 h-28 bg-[#f43f5e] border-4 border-black rounded-2xl rotate-12 opacity-35"
  ></div>

  <!-- Verify Card Container -->
  <div class="relative z-10 w-full max-w-md">
    <div
      class="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 sm:p-8 relative"
    >
      {#if loading}
        <!-- Loading State -->
        <div class="text-center py-8">
          <div
            class="w-16 h-16 bg-[#38bdf8] border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-5"
          >
            <svg
              class="animate-spin h-8 w-8 text-black"
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
          </div>

          <h2
            class="text-2xl font-black uppercase tracking-tight text-black mb-2"
          >
            Verifying Token...
          </h2>
          <p class="text-xs sm:text-sm font-semibold text-black/70">
            Please wait while we verify your email address.
          </p>
        </div>
      {:else if success}
        <!-- Success State -->
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
            Email Verified
          </div>

          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2"
          >
            Account Activated!
          </h1>

          <p class="text-xs sm:text-sm font-semibold text-black/70 mb-6">
            Your email address has been successfully verified. You can now sign
            in to your account.
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
        <!-- Form / Error State -->
        <div class="mb-6 flex flex-col items-center text-center">
          <div
            class="w-14 h-14 bg-[#38bdf8] border-3 sm:border-4 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-2xl mb-3 transform -rotate-3 hover:rotate-0 transition-transform"
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
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <div
            class="inline-block bg-black text-white px-2.5 py-0.5 rounded border border-black text-[11px] font-black uppercase tracking-wider mb-1"
          >
            Verification
          </div>
          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black"
          >
            Verify Email
          </h1>
          <p class="text-xs sm:text-sm font-semibold text-black/70 mt-1">
            Enter the verification token received in your email
          </p>
        </div>

        {#if error}
          <div
            class="mb-5 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-start space-x-2.5"
          >
            <span class="text-lg shrink-0">
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
              {#if attemptedAutoVerify}
                <p class="text-xs font-semibold text-rose-800 mt-1">
                  You can paste a different token below and try again.
                </p>
              {/if}
            </div>
          </div>
        {/if}

        <form on:submit|preventDefault={() => handleVerify()} class="space-y-4">
          <div>
            <label
              for="verify-token"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Verification Token
            </label>
            <input
              id="verify-token"
              type="text"
              bind:value={token}
              placeholder="Paste 64-character verification token"
              required
              on:keypress={handleKeyPress}
              class="w-full px-4 py-3 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-mono font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            class="w-full mt-2 py-3.5 px-4 bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:opacity-60 border-3 border-black text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Verify Token</span>
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
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>

          <!-- Navigation Links -->
          <div class="pt-3 flex flex-col items-center gap-2.5">
            <div class="text-xs font-bold text-black/80">
              Back to
              <a
                href="/login"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Sign In
              </a>
              or
              <a
                href="/register"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Register
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
