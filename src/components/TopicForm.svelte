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

    if (!formData.name) {
      errors.name = "Topic name is required";
    }

    if (!formData.description) {
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

<div class="modal-overlay" on:click={handleClose} role="presentation">
  <div class="modal-content" on:click|stopPropagation role="presentation">
    <div class="modal-header">
      <h2>{topic ? "Edit Topic" : "Add New Topic"}</h2>
      <button class="btn-close" on:click={handleClose}>×</button>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="name">Topic Name</label>
        <input
          id="name"
          type="text"
          bind:value={formData.name}
          placeholder="Enter topic name"
        />
        {#if errors.name}
          <span class="error">{errors.name}</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Enter topic description"
          rows="4"
        />
        {#if errors.description}
          <span class="error">{errors.description}</span>
        {/if}
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-secondary" on:click={handleClose}
          >Cancel</button
        >
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .modal-content {
    background: white;
    border-radius: var(--radius);
    padding: 30px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-header h2 {
    margin: 0;
    color: var(--primary);
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #999;
  }

  .btn-close:hover {
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text);
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
  }

  .error {
    color: var(--danger);
    font-size: 12px;
    display: block;
    margin-top: 4px;
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 30px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background-color: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: #2952a3;
  }

  .btn-secondary {
    background-color: var(--border);
    color: var(--text);
  }

  .btn-secondary:hover {
    background-color: #ccc;
  }
</style>
