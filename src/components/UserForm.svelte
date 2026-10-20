<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { User, CreateUserRequest } from "../api/client";

  const dispatch = createEventDispatcher();

  export let user: User | null = null;

  let formData: CreateUserRequest = {
    username: "",
    email: "",
    password: "",
    role: "student",
    is_verified: false,
  };

  let errors: Record<string, string> = {};

  let currentUserId: number | null = null;

  $: if (user) {
    if (user.id !== currentUserId) {
      currentUserId = user.id;
      formData = {
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role ? user.role.toLowerCase() : "student",
        is_verified: user.is_verified ?? false,
      };
    }
  } else if (currentUserId !== null) {
    currentUserId = null;
    formData = {
      username: "",
      email: "",
      password: "",
      role: "student",
      is_verified: false,
    };
  }

  function validateForm(): boolean {
    errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!user && !formData.password) {
      errors.password = "Password is required";
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    const submitData: any = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }

    dispatch("submit", submitData);
  }

  function handleClose() {
    dispatch("close");
  }
</script>

<div
  class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 selection:bg-black selection:text-[#fde047]"
  on:click={handleClose}
  role="presentation"
>
  <div
    class="bg-white rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black w-full max-w-md overflow-hidden relative"
    on:click|stopPropagation
    role="presentation"
  >
    <!-- Modal Header -->
    <div
      class="flex items-center justify-between px-6 py-4 bg-[#fdf5cb] border-b-3 border-black"
    >
      <div class="flex items-center space-x-2.5">
        <span
          class="w-8 h-8 bg-[#fde047] border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-sm font-black"
        >
          👥
        </span>
        <h2 class="text-lg font-black uppercase tracking-tight text-black">
          {user ? "Edit User" : "Add New User"}
        </h2>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black font-black text-sm leading-none transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        on:click={handleClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <!-- Modal Form -->
    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4">
      <div>
        <label
          for="username"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Username <span class="text-rose-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          bind:value={formData.username}
          placeholder="e.g. john_doe"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.username
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.username}
          <p class="mt-1 text-xs font-bold text-rose-600">{errors.username}</p>
        {/if}
      </div>

      <div>
        <label
          for="email"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Email <span class="text-rose-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          bind:value={formData.email}
          placeholder="e.g. user@example.com"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.email
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.email}
          <p class="mt-1 text-xs font-bold text-rose-600">{errors.email}</p>
        {/if}
      </div>

      <div>
        <label
          for="password"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Password {#if user}<span class="text-[10px] font-bold text-black/50"
              >(leave empty to keep current)</span
            >{:else}<span class="text-rose-500">*</span>{/if}
        </label>
        <input
          id="password"
          type="password"
          bind:value={formData.password}
          placeholder="••••••••"
          required={!user}
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.password
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.password}
          <p class="mt-1 text-xs font-bold text-rose-600">{errors.password}</p>
        {/if}
      </div>

      <div>
        <label
          for="role"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >Role</label
        >
        <select
          id="role"
          bind:value={formData.role}
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label
          for="is_verified"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >Verified Status</label
        >
        <select
          id="is_verified"
          bind:value={formData.is_verified}
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
        >
          <option value={true}>Verified (True)</option>
          <option value={false}>Unverified (False)</option>
        </select>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black/10"
      >
        <button
          type="button"
          class="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-gray-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
          on:click={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-[#fde047] hover:bg-[#facc15] rounded-xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
        >
          Save User
        </button>
      </div>
    </form>
  </div>
</div>
