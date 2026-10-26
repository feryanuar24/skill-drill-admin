<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Layout from "../components/Layout.svelte";
  import Table, { type Column, type PaginationData } from "../components/Table.svelte";
  import apiClient, { type User, type UserQueryParams } from "../api/client";
  import { formatDateTime } from "../utils/helpers";
  import UserForm from "../components/UserForm.svelte";

  let users: User[] = [];
  let pagination: PaginationData | null = null;
  let loading = false;
  let error = "";
  let success = "";
  let showForm = false;
  let editingUser: User | null = null;

  // Filters & Search
  let searchQuery = "";
  let selectedRole = "all";
  let selectedStatus = "all";

  // Sorting
  let sortBy = "created_at";
  let sortOrder: "asc" | "desc" = "desc";

  // Pagination
  let page = 1;
  let limit = 10;

  let searchDebounceTimer: any;

  onMount(async () => {
    await loadUsers();
  });

  onDestroy(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
  });

  async function loadUsers() {
    loading = true;
    error = "";
    try {
      const params: UserQueryParams = {
        page,
        limit,
        sort_by: sortBy,
        order: sortOrder,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (selectedRole !== "all") {
        params.role = selectedRole;
      }

      if (selectedStatus === "verified") {
        params.is_verified = true;
      } else if (selectedStatus === "unverified") {
        params.is_verified = false;
      }

      const res = await apiClient.getUsersPaginated(params);
      users = res.users;
      pagination = res.pagination ?? null;
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to load users";
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      page = 1;
      loadUsers();
    }, 350);
  }

  function handleFilterChange() {
    page = 1;
    loadUsers();
  }

  function handleClearFilters() {
    searchQuery = "";
    selectedRole = "all";
    selectedStatus = "all";
    page = 1;
    loadUsers();
  }

  function handleSort(colKey: string) {
    if (sortBy === colKey) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortBy = colKey;
      sortOrder = "asc";
    }
    page = 1;
    loadUsers();
  }

  function handlePageChange(newPage: number) {
    page = newPage;
    loadUsers();
  }

  function handleLimitChange(newLimit: number) {
    limit = newLimit;
    page = 1;
    loadUsers();
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
    success = "";
    try {
      await apiClient.deleteUser(user.id);
      success = `User "${user.username}" deleted successfully!`;
      // If we deleted the only item on the current page and we're past page 1, go back one page
      if (users.length === 1 && page > 1) {
        page -= 1;
      }
      await loadUsers();
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
    success = "";

    try {
      if (editingUser) {
        await apiClient.updateUser(editingUser.id, formData);
        success = "User updated successfully!";
      } else {
        await apiClient.createUser(formData);
        success = "User created successfully!";
      }
      handleFormClose();
      await loadUsers();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to save user";
    }
  }

  const columns: Column[] = [
    { key: "username", label: "Username", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", width: "130px", sortable: true },
    { key: "is_verified", label: "Verified", width: "130px", sortable: true },
    { key: "created_at", label: "Created At", width: "190px", sortable: true },
  ];

  $: hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedRole !== "all" ||
    selectedStatus !== "all";
</script>

<Layout title="Users Management">
  <!-- Top Banner -->
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]"
  >
    <div>
      <div
        class="inline-block bg-[#bae6fd] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black mb-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
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
          stroke-width="2"
          stroke="currentColor"
          class="size-5"
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

  <!-- Messages -->
  {#if error}
    <div
      class="mb-6 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
    >
      <span class="text-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="size-5 text-rose-600"
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

  {#if success}
    <div
      class="mb-6 p-3.5 bg-[#bbf7d0] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="size-5 text-emerald-700"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      </span>
      <span>{success}</span>
    </div>
  {/if}

  <!-- Filters & Search Toolbar -->
  <div
    class="bg-white rounded-2xl border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
  >
    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap"
    >
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[200px]">
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleSearchInput}
          placeholder="Search by username or email..."
          class="w-full pl-9 pr-8 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4 text-black/50 absolute left-3 top-1/2 -translate-y-1/2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        {#if searchQuery}
          <button
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black font-black text-xs cursor-pointer p-0.5"
            on:click={() => {
              searchQuery = "";
              page = 1;
              loadUsers();
            }}
          >
            ✕
          </button>
        {/if}
      </div>

      <!-- Role Filter -->
      <div class="w-full sm:w-40">
        <label for="filter-role" class="sr-only">Filter by Role</label>
        <select
          id="filter-role"
          bind:value={selectedRole}
          on:change={handleFilterChange}
          class="w-full px-3 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <option value="all">👤 All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>

      <!-- Verification Status Filter -->
      <div class="w-full sm:w-44">
        <label for="filter-status" class="sr-only">Filter by Verification</label>
        <select
          id="filter-status"
          bind:value={selectedStatus}
          on:change={handleFilterChange}
          class="w-full px-3 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <option value="all">✓ All Status</option>
          <option value="verified">Verified Only</option>
          <option value="unverified">Unverified Only</option>
        </select>
      </div>
    </div>

    <!-- Active Filters Count & Reset -->
    <div
      class="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0"
    >
      <span
        class="text-[11px] font-black uppercase tracking-wider bg-[#fdf5cb] border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
      >
        Total: {pagination?.total_items ?? users.length}
      </span>
      {#if hasActiveFilters}
        <button
          class="text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer transition-all active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          on:click={handleClearFilters}
        >
          Reset Filters
        </button>
      {/if}
    </div>
  </div>

  {#if showForm}
    <UserForm
      user={editingUser}
      on:submit={handleFormSubmit}
      on:close={handleFormClose}
    />
  {/if}

  <Table
    {columns}
    rows={users}
    {loading}
    {sortBy}
    {sortOrder}
    {pagination}
    onSort={handleSort}
    onPageChange={handlePageChange}
    onLimitChange={handleLimitChange}
    onEdit={handleEdit}
    onDelete={handleDelete}
  >
    <!-- Custom Cell Rendering -->
    <svelte:fragment slot="cell" let:row let:col>
      {#if col.key === "role"}
        {#if row.role?.toLowerCase() === "admin"}
          <span
            class="inline-block px-2.5 py-0.5 bg-[#bae6fd] border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
          >
            ADMIN
          </span>
        {:else}
          <span
            class="inline-block px-2.5 py-0.5 bg-[#fde047] border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
          >
            STUDENT
          </span>
        {/if}
      {:else if col.key === "is_verified"}
        {#if row.is_verified}
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#bbf7d0] border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider text-emerald-950 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
          >
            <svg
              class="w-3 h-3 text-emerald-800"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clip-rule="evenodd"
              />
            </svg>
            YES
          </span>
        {:else}
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffe4e6] border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider text-rose-950 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
          >
            NO
          </span>
        {/if}
      {:else if col.key === "created_at"}
        <span class="text-xs font-semibold text-black/80">
          {formatDateTime(row.created_at)}
        </span>
      {:else}
        <span>
          {row[col.key] !== undefined && row[col.key] !== null
            ? row[col.key]
            : "-"}
        </span>
      {/if}
    </svelte:fragment>
  </Table>
</Layout>
