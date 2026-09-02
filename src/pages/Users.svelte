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

  function handleEdit(row: any) {
    const user = users.find((u) => u.id === row.id) || row;
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
    { key: "is_verified", label: "Verified", width: "110px" },
    { key: "created_at", label: "Created At", width: "180px" },
  ];

  $: displayRows = users.map((u) => ({
    ...u,
    role: u.role.toUpperCase(),
    is_verified: u.is_verified ? "YES" : "NO",
    created_at: formatDateTime(u.created_at),
  }));
</script>

<Layout title="Users Management">
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]"
  >
    <div>
      <div
        class="inline-block bg-[#bae6fd] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black mb-1"
      >
        Accounts
      </div>
      <p class="text-xs sm:text-sm font-bold text-black/80">
        Manage registered students and administrator platform accounts.
      </p>
    </div>
    <button
      class="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#fde047] hover:bg-[#facc15] text-black text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer shrink-0"
      on:click={handleAddNew}
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </span>
      <span>Add New User</span>
    </button>
  </div>

  {#if error}
    <div
      class="mb-6 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
    >
      <span class="text-lg"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </span>
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
