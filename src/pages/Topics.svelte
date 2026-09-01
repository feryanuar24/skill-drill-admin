<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import Table from "../components/Table.svelte";
  import apiClient, { type Topic } from "../api/client";
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
    { key: "name", label: "Topic Name", width: "220px" },
    { key: "description", label: "Description" },
    { key: "created_at", label: "Created At", width: "180px" },
  ];

  $: displayRows = topics.map((t) => ({
    ...t,
    created_at: formatDateTime(t.created_at),
  }));
</script>

<Layout title="Topics Management">
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
  >
    <p class="text-sm text-gray-500">
      Manage and organize skill categories and question subjects.
    </p>
    <button
      class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-600-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
      on:click={handleAddNew}
    >
      <span>➕</span>
      <span>Add New Topic</span>
    </button>
  </div>

  {#if error}
    <div
      class="mb-6 p-4 bg-red-600-light border border-red-200 text-red-600 text-sm rounded-xl flex items-center space-x-2"
    >
      <span>⚠️</span>
      <span>{error}</span>
    </div>
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
