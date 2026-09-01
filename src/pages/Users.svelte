<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import Table from "../components/Table.svelte";
  import apiClient, { type User } from "../api/client";
  import { formatDateTime } from "../utils/helpers";
  import UserForm from "../components/UserForm.svelte";

  let users: User[] = [];
  let loading = false;
  let error = "";
  let showForm = false;
  let editingUser: User | null = null;

  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    loading = true;
    error = "";
    try {
      users = await apiClient.getUsers();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to load users";
    } finally {
      loading = false;
    }
  }

  function handleEdit(user: User) {
    editingUser = user;
    showForm = true;
  }

  async function handleDelete(user: User) {
    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }

    error = "";
    try {
      await apiClient.deleteUser(user.id);
      users = users.filter((u) => u.id !== user.id);
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to delete user";
    }
  }

  function handleAddNew() {
    editingUser = null;
    showForm = true;
  }

  function handleFormClose() {
    showForm = false;
    editingUser = null;
  }

  async function handleFormSubmit(e: CustomEvent) {
    const formData = e.detail;
    error = "";

    try {
      if (editingUser) {
        const updated = await apiClient.updateUser(editingUser.id, formData);
        users = users.map((u) => (u.id === updated.id ? updated : u));
      } else {
        const created = await apiClient.createUser(formData);
        users = [...users, created];
      }
      handleFormClose();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to save user";
    }
  }

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", width: "120px" },
    { key: "is_verified", label: "Verified", width: "100px" },
    { key: "created_at", label: "Created At", width: "180px" },
  ];

  $: displayRows = users.map((u) => ({
    ...u,
    is_verified: u.is_verified ? "Yes" : "No",
    created_at: formatDateTime(u.created_at),
  }));
</script>

<Layout title="Users Management">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <p class="text-sm text-gray-500">
      Manage registered students and administrator accounts.
    </p>
    <button
      class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
      on:click={handleAddNew}
    >
      <span>➕</span>
      <span>Add New User</span>
    </button>
  </div>

  {#if error}
    <div class="mb-6 p-4 bg-danger-light border border-red-200 text-danger text-sm rounded-xl flex items-center space-x-2">
      <span>⚠️</span>
      <span>{error}</span>
    </div>
  {/if}

  {#if showForm}
    <UserForm
      user={editingUser}
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
