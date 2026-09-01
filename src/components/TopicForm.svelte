<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Topic, CreateTopicRequest } from "../api/client";

  const dispatch = createEventDispatcher();

  export let topic: Topic | null = null;

  let formData: CreateTopicRequest = {
    name: "",
    description: "",
  };

  let errors: Record<string, string> = {};

  $: if (topic) {
    formData = {
      name: topic.name,
      description: topic.description,
    };
  }

  function validateForm(): boolean {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = "Topic name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    dispatch("submit", formData);
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
        {topic ? "Edit Topic" : "Add New Topic"}
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
    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-5">
      <div>
        <label
          for="name"
          class="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Topic Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          bind:value={formData.name}
          placeholder="e.g. Data Structures & Algorithms"
          class="w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none transition-all {errors.name
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}"
        />
        {#if errors.name}
          <p class="mt-1 text-xs text-red-600">{errors.name}</p>
        {/if}
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Enter a brief overview of this learning topic..."
          rows="4"
          class="w-full px-3.5 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none transition-all {errors.description
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}"
        />
        {#if errors.description}
          <p class="mt-1 text-xs text-red-600">{errors.description}</p>
        {/if}
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
          Save Topic
        </button>
      </div>
    </form>
  </div>
</div>
