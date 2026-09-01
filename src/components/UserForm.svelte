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
  };

  let errors: Record<string, string> = {};

  $: if (user) {
    formData = {
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
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

    const submitData = { ...formData };
    if (!user && !submitData.password) {
      delete (submitData as any).password;
    }

    dispatch("submit", submitData);
  }

  function handleClose() {
    dispatch("close");
  }
</script>

<div
  class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
  on:click={handleClose}
  role="presentation"
>
  <div
    class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
    on:click|stopPropagation
    role="presentation"
  >
    <!-- Modal Header -->
    <div
      class="flex items-center justify-between px-6 py-5 border-b border-gray-100"
    >
      <h2 class="text-xl font-bold text-gray-900">
        {user ? "Edit User" : "Add New User"}
      </h2>
      <button
        class="text-gray-400 hover:text-gray-600 rounded-lg p-1 text-2xl leading-none transition-colors cursor-pointer"
        on:click={handleClose}
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    <!-- Modal Form -->
    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4">
      <div>
        <label
          for="username"
          class="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Username <span class="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          bind:value={formData.username}
          placeholder="e.g. john_doe"
          class="w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none transition-all {errors.username
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}"
        />
        {#if errors.username}
          <p class="mt-1 text-xs text-red-600">{errors.username}</p>
        {/if}
      </div>

      <div>
        <label
          for="email"
          class="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          bind:value={formData.email}
          placeholder="e.g. user@example.com"
          class="w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none transition-all {errors.email
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}"
        />
        {#if errors.email}
          <p class="mt-1 text-xs text-red-600">{errors.email}</p>
        {/if}
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Password {#if user}<span class="text-xs font-normal text-gray-400"
              >(leave empty to keep current)</span
            >{:else}<span class="text-red-500">*</span>{/if}
        </label>
        <input
          id="password"
          type="password"
          bind:value={formData.password}
          placeholder="••••••••"
          required={!user}
          class="w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none transition-all {errors.password
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}"
        />
        {#if errors.password}
          <p class="mt-1 text-xs text-red-600">{errors.password}</p>
        {/if}
      </div>

      <div>
        <label
          for="role"
          class="block text-sm font-semibold text-gray-700 mb-1.5">Role</label
        >
        <select
          id="role"
          bind:value={formData.role}
          class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100"
      >
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          on:click={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-600-hover rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Save User
        </button>
      </div>
    </form>
  </div>
</div>
