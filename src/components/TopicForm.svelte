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
          📚
        </span>
        <h2 class="text-lg font-black uppercase tracking-tight text-black">
          {topic ? "Edit Topic" : "Add New Topic"}
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
          for="name"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Topic Name <span class="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          bind:value={formData.name}
          placeholder="e.g. Data Structures & Algorithms"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.name
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.name}
          <p class="mt-1 text-xs font-bold text-rose-600">{errors.name}</p>
        {/if}
      </div>

      <div>
        <label
          for="description"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Description <span class="text-rose-500">*</span>
        </label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Enter a brief overview of this learning topic..."
          rows="4"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.description
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.description}
          <p class="mt-1 text-xs font-bold text-rose-600">
            {errors.description}
          </p>
        {/if}
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
          Save Topic
        </button>
      </div>
    </form>
  </div>
</div>
