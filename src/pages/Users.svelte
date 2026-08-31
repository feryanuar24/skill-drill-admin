<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import Table from "../components/Table.svelte";
  import apiClient, { type User, type CreateUserRequest } from "../api/client";
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
    { key: "role", label: "Role" },
    { key: "is_verified", label: "Verified" },
    { key: "created_at", label: "Created At" },
  ];

  const displayRows = users.map((u) => ({
    ...u,
    is_verified: u.is_verified ? "Yes" : "No",
    created_at: formatDateTime(u.created_at),
  }));
</script>

<Layout title="Users Management">
  <div class="header">
    <button class="btn-primary" on:click={handleAddNew}>+ Add New User</button>
  </div>

  {#if error}
    <div class="error-message">{error}</div>
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
