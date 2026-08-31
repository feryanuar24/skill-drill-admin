<script lang="ts">
  interface Column {
    key: string;
    label: string;
    width?: string;
  }

  export let columns: Column[] = [];
  export let rows: any[] = [];
  export let loading = false;

  export let onEdit: (row: any) => void = () => {};
  export let onDelete: (row: any) => void = () => {};
</script>

<div class="table-container">
  {#if loading}
    <div class="loading">Loading...</div>
  {:else if rows.length === 0}
    <div class="empty">No data available</div>
  {:else}
    <table>
      <thead>
        <tr>
          {#each columns as col}
            <th style:width={col.width || "auto"}>{col.label}</th>
          {/each}
          <th style:width="150px">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            {#each columns as col}
              <td>{row[col.key]}</td>
            {/each}
            <td class="actions">
              <button class="btn-sm btn-primary" on:click={() => onEdit(row)}
                >Edit</button
              >
              <button class="btn-sm btn-danger" on:click={() => onDelete(row)}
                >Delete</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .table-container {
    background: white;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: var(--primary);
    color: white;
  }

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--primary);
  }

  td {
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 12px;
    border: none;
    border-radius: 4px;
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

  .btn-danger {
    background-color: var(--danger);
    color: white;
  }

  .btn-danger:hover {
    background-color: #bb2222;
  }

  .loading,
  .empty {
    padding: 40px;
    text-align: center;
    color: #666;
  }
</style>
