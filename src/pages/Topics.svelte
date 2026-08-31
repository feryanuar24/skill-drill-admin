<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import Table from "../components/Table.svelte";
  import apiClient, {
    type Topic,
    type CreateTopicRequest,
  } from "../api/client";
  import { formatDateTime } from "../utils/helpers";
  import TopicForm from "../components/TopicForm.svelte";

  let topics: Topic[] = [];
  let loading = false;
  let error = "";
  let showForm = false;
  let editingTopic: Topic | null = null;

  onMount(async () => {
    await loadTopics();
  });

  async function loadTopics() {
    loading = true;
    error = "";
    try {
      topics = await apiClient.getTopics();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to load topics";
    } finally {
      loading = false;
    }
  }

  function handleEdit(topic: Topic) {
    editingTopic = topic;
    showForm = true;
  }

  async function handleDelete(topic: Topic) {
    if (!confirm(`Are you sure you want to delete topic "${topic.name}"?`)) {
      return;
    }

    error = "";
    try {
      await apiClient.deleteTopic(topic.id);
      topics = topics.filter((t) => t.id !== topic.id);
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to delete topic";
    }
  }

  function handleAddNew() {
    editingTopic = null;
    showForm = true;
  }

  function handleFormClose() {
    showForm = false;
    editingTopic = null;
  }

  async function handleFormSubmit(e: CustomEvent) {
    const formData = e.detail;
    error = "";

    try {
      if (editingTopic) {
        const updated = await apiClient.updateTopic(editingTopic.id, formData);
        topics = topics.map((t) => (t.id === updated.id ? updated : t));
      } else {
        const created = await apiClient.createTopic(formData);
        topics = [...topics, created];
      }
      handleFormClose();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to save topic";
    }
  }

  const columns = [
    { key: "name", label: "Topic Name", width: "200px" },
    { key: "description", label: "Description" },
    { key: "created_at", label: "Created At" },
  ];

  const displayRows = topics.map((t) => ({
    ...t,
    created_at: formatDateTime(t.created_at),
  }));
</script>

<Layout title="Topics Management">
  <div class="header">
    <button class="btn-primary" on:click={handleAddNew}>+ Add New Topic</button>
  </div>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  {#if showForm}
    <TopicForm
      topic={editingTopic}
      on:submit={handleFormSubmit}
      on:close={handleFormClose}
    />
  {/if}

  <Table
    {columns}
    rows={displayRows}
    {loading}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
</Layout>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .btn-primary {
    background-color: var(--primary);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background-color: #2952a3;
  }

  .error-message {
    background-color: #ffe6e6;
    color: var(--danger);
    padding: 12px;
    border-radius: var(--radius);
    margin-bottom: 20px;
  }
</style>
