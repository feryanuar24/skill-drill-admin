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

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  {#if loading}
    <div class="py-16 flex flex-col items-center justify-center text-gray-500 space-y-3">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm font-medium">Loading data...</span>
    </div>
  {:else if rows.length === 0}
    <div class="py-16 flex flex-col items-center justify-center text-gray-500 space-y-2">
      <span class="text-4xl">📭</span>
      <p class="text-base font-medium text-gray-600">No data available</p>
      <p class="text-xs text-gray-400">There are no records to display at this moment.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {#each columns as col}
              <th class="py-3.5 px-4 sm:px-6" style:width={col.width || "auto"}>
                {col.label}
              </th>
            {/each}
            <th class="py-3.5 px-4 sm:px-6 text-right w-40">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm text-gray-700">
          {#each rows as row}
            <tr class="hover:bg-gray-50/80 transition-colors">
              {#each columns as col}
                <td class="py-4 px-4 sm:px-6">
                  {row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : "-"}
                </td>
              {/each}
              <td class="py-4 px-4 sm:px-6 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    class="px-3 py-1.5 text-xs font-medium text-primary bg-primary-light hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer"
                    on:click={() => onEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs font-medium text-danger bg-danger-light hover:bg-danger hover:text-white rounded-lg transition-colors cursor-pointer"
                    on:click={() => onDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
