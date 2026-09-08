<script lang="ts">
  import apiClient, { type RegisterResponse } from "../api/client";
  import { link } from "../stores/routerCompat";

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let error = "";
  let fieldErrors: Record<string, string[]> = {};
  let loading = false;
  let registeredSuccess = false;
  let registeredEmail = "";

  // Password rules validation
  $: hasMinLength = password.length >= 8;
  $: hasUpper = /[A-Z]/.test(password);
  $: hasLower = /[a-z]/.test(password);
  $: hasNumber = /[0-9]/.test(password);
  $: hasSymbol = /[^A-Za-z0-9]/.test(password);
  $: passwordsMatch = password.length > 0 && password === confirmPassword;
  $: isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol;

  async function handleRegister() {
    error = "";
    fieldErrors = {};

    // Client-side validations
    if (username.trim().length < 3) {
      error = "Username must be at least 3 characters long.";
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
      const response: RegisterResponse = await apiClient.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      registeredEmail = response.user?.email || email;
      registeredSuccess = true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        fieldErrors = err.response.data.errors;
        error =
          err.response?.data?.message ||
          "Registration failed. Please correct the fields below.";
      } else {
        error =
          err.response?.data?.message ||
          "Registration failed. Please check your information and try again.";
      }
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleRegister();
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
    class="absolute -top-12 -right-12 w-48 h-48 rounded-full border-4 border-black bg-[#86efac] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-4 border-black bg-[#f43f5e] z-0 opacity-30 blur-xs"
  ></div>
  <div
    class="absolute top-1/3 -left-8 w-28 h-28 bg-[#a78bfa] border-4 border-black rounded-2xl -rotate-12 opacity-35"
  ></div>

  <!-- Register Card Container -->
  <div class="relative z-10 w-full max-w-lg">
    <div
      class="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 sm:p-8 relative"
    >
      {#if registeredSuccess}
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
            Registration Complete
          </div>

          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-2"
          >
            Verify Your Email
          </h1>

          <p class="text-sm font-semibold text-black/80 mb-4 max-w-md mx-auto">
            We have registered your account and sent a verification token to:
          </p>

          <div
            class="bg-[#fef9c3] border-3 border-black p-3 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] font-mono font-bold text-sm text-black mb-6 break-all"
          >
            {registeredEmail}
          </div>

          <p class="text-xs font-medium text-black/70 mb-6">
            Please check your inbox for the verification token to activate your
            account.
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <a
              href="/verify-email"
              use:link
              class="flex-1 py-3.5 px-4 bg-[#fde047] hover:bg-[#facc15] border-3 border-black text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Verification Token</span>
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

            <a
              href="/login"
              use:link
              class="py-3.5 px-4 bg-white hover:bg-gray-100 border-3 border-black text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center"
            >
              Sign In
            </a>
          </div>
        </div>
      {:else}
        <!-- Header Badge / Brand -->
        <div class="mb-6 flex flex-col items-center text-center">
          <div
            class="w-14 h-14 bg-[#86efac] border-3 sm:border-4 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-2xl mb-3 transform rotate-3 hover:rotate-0 transition-transform"
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
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </div>
          <div
            class="inline-block bg-black text-white px-2.5 py-0.5 rounded border border-black text-[11px] font-black uppercase tracking-wider mb-1"
          >
            Skill Drill
          </div>
          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black"
          >
            Create Account
          </h1>
          <p class="text-xs sm:text-sm font-semibold text-black/70 mt-1">
            Register a new account for Skill Drill
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

        <form on:submit|preventDefault={handleRegister} class="space-y-4">
          <div>
            <label
              for="reg-username"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              bind:value={username}
              placeholder="e.g. john_doe"
              required
              minlength="3"
              maxlength="50"
              class="w-full px-4 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {fieldErrors.username
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
            {#if fieldErrors.username}
              <p class="mt-1 text-xs font-bold text-rose-600">
                {fieldErrors.username[0]}
              </p>
            {/if}
          </div>

          <div>
            <label
              for="reg-email"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              bind:value={email}
              placeholder="admin@example.com"
              required
              class="w-full px-4 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-3 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {fieldErrors.email
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
            {#if fieldErrors.email}
              <p class="mt-1 text-xs font-bold text-rose-600">
                {fieldErrors.email[0]}
              </p>
            {/if}
          </div>

          <div>
            <label
              for="reg-password"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Password
            </label>
            <input
              id="reg-password"
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
              for="reg-confirm-password"
              class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
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
            class="w-full mt-2 py-3.5 px-4 bg-[#86efac] hover:bg-[#4ade80] disabled:opacity-60 border-3 border-black text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
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
              <span>Creating Account...</span>
            {:else}
              <span>Create Account</span>
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
              Already have an account?
              <a
                href="/login"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Sign In
              </a>
            </div>

            <div class="text-xs font-bold text-black/60">
              Already have a token?
              <a
                href="/verify-email"
                use:link
                class="font-black text-black underline hover:text-black/70 ml-1"
              >
                Verify Email
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
