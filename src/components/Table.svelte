<script context="module" lang="ts">
  export interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
  }

  export interface PaginationData {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }
</script>

<script lang="ts">
  export let columns: Column[] = [];
  export let rows: any[] = [];
  export let loading = false;

  export let sortBy = "";
  export let sortOrder: "asc" | "desc" = "desc";
  export let onSort: (colKey: string) => void = () => {};

  export let pagination: PaginationData | null = null;
  export let onPageChange: (page: number) => void = () => {};
  export let onLimitChange: (limit: number) => void = () => {};
  export let limitOptions: number[] = [10, 25, 50, 100];

  export let onEdit: (row: any) => void = () => {};
  export let onDelete: (row: any) => void = () => {};

  function handleHeaderClick(col: Column) {
    if (col.sortable !== false && onSort) {
      onSort(col.key);
    }
  }

  $: totalItems = pagination?.total_items ?? rows.length;
  $: page = pagination?.page ?? 1;
  $: limit = pagination?.limit ?? rows.length;
  $: totalPages =
    pagination?.total_pages ??
    Math.max(1, Math.ceil(totalItems / (limit > 0 ? limit : 1)));

  $: fromItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  $: toItem = totalItems === 0 ? 0 : Math.min(page * limit, totalItems);

  function getVisiblePages(current: number, total: number): (number | string)[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }

    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  $: visiblePages = getVisiblePages(page, totalPages);
</script>

<div
  class="bg-white rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden flex flex-col"
>
  {#if loading}
    <div
      class="py-16 flex flex-col items-center justify-center text-black space-y-3"
    >
      <svg
        class="animate-spin h-9 w-9 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-sm font-black uppercase tracking-wider text-black"
        >Loading records...</span
      >
    </div>
  {:else if rows.length === 0}
    <div
      class="py-16 flex flex-col items-center justify-center text-black space-y-2"
    >
      <span
        class="text-4xl p-3 bg-[#fdf5cb] border-3 border-black rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-2"
        >📭</span
      >
      <p class="text-base font-black uppercase text-black">No data available</p>
      <p class="text-xs font-bold text-black/60">
        There are no records to display matching your criteria.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto flex-1">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-[#fde047] border-b-3 border-black text-xs font-black text-black uppercase tracking-wider select-none"
          >
            {#each columns as col}
              {@const isSortable = col.sortable !== false}
              {@const isSorted = sortBy === col.key}
              <th
                class="py-4 px-4 sm:px-6 transition-colors {isSortable
                  ? 'cursor-pointer hover:bg-[#facc15]'
                  : ''}"
                style:width={col.width || "auto"}
                on:click={() => handleHeaderClick(col)}
              >
                <div class="inline-flex items-center space-x-1.5">
                  <span>{col.label}</span>
                  {#if isSortable}
                    <span class="inline-flex flex-col text-[10px] leading-none shrink-0">
                      {#if isSorted}
                        {#if sortOrder === "asc"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-4 h-4 text-black font-black"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        {:else}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-4 h-4 text-black font-black"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        {/if}
                      {:else}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="w-3.5 h-3.5 text-black/35 group-hover:text-black/60"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      {/if}
                    </span>
                  {/if}
                </div>
              </th>
            {/each}
            <th class="py-4 px-4 sm:px-6 text-right w-44">Actions</th>
          </tr>
        </thead>
        <tbody
          class="divide-y-2 divide-black/10 text-xs sm:text-sm font-semibold text-black"
        >
          {#each rows as row (row.id || JSON.stringify(row))}
            <tr class="hover:bg-[#fef9c3]/50 transition-colors">
              {#each columns as col}
                <td class="py-4 px-4 sm:px-6">
                  <slot name="cell" {row} {col}>
                    {row[col.key] !== undefined && row[col.key] !== null
                      ? row[col.key]
                      : "-"}
                  </slot>
                </td>
              {/each}
              <td class="py-4 px-4 sm:px-6 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    class="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#38bdf8] hover:bg-[#0284c7] hover:text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    on:click={() => onEdit(row)}
                    title="Edit Record"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.8"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#f43f5e] hover:bg-[#e11d48] rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    on:click={() => onDelete(row)}
                    title="Delete Record"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.8"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Neo-brutalist Pagination Footer -->
  {#if pagination && totalItems > 0}
    <div
      class="bg-[#fefce8] border-t-3 border-black p-4 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <!-- Entries Info & Limit Selector -->
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs font-bold text-black">
          Showing <span class="font-black text-black">{fromItem}</span> to
          <span class="font-black text-black">{toItem}</span> of
          <span class="font-black text-black">{totalItems}</span> entries
        </span>

        <div class="flex items-center space-x-1.5 pl-2 border-l-2 border-black/20">
          <label for="table-limit-select" class="text-xs font-bold text-black/70">Per page:</label>
          <select
            id="table-limit-select"
            value={limit}
            on:change={(e) => onLimitChange(Number(e.currentTarget.value))}
            class="px-2 py-1 bg-white border-2 border-black rounded-lg text-xs font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
          >
            {#each limitOptions as opt}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center space-x-1 sm:space-x-1.5 flex-wrap justify-center">
        <!-- First Page -->
        <button
          class="px-2.5 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#fde047] disabled:opacity-40 disabled:pointer-events-none active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          disabled={page <= 1}
          on:click={() => onPageChange(1)}
          title="First Page"
        >
          «
        </button>

        <!-- Previous Page -->
        <button
          class="px-3 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#fde047] disabled:opacity-40 disabled:pointer-events-none active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          disabled={page <= 1}
          on:click={() => onPageChange(page - 1)}
          title="Previous Page"
        >
          ‹
        </button>

        <!-- Page Numbers -->
        {#each visiblePages as p}
          {#if p === "..."}
            <span class="px-2 py-1 text-xs font-black text-black/50 select-none">
              ...
            </span>
          {:else}
            <button
              class="min-w-8 px-2.5 py-1.5 border-2 border-black rounded-lg text-xs font-black transition-all cursor-pointer {p === page
                ? 'bg-[#fde047] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] scale-105'
                : 'bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#fef9c3] active:shadow-none active:translate-x-0.5 active:translate-y-0.5'}"
              on:click={() => onPageChange(Number(p))}
            >
              {p}
            </button>
          {/if}
        {/each}

        <!-- Next Page -->
        <button
          class="px-3 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#fde047] disabled:opacity-40 disabled:pointer-events-none active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          disabled={page >= totalPages}
          on:click={() => onPageChange(page + 1)}
          title="Next Page"
        >
          ›
        </button>

        <!-- Last Page -->
        <button
          class="px-2.5 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#fde047] disabled:opacity-40 disabled:pointer-events-none active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          disabled={page >= totalPages}
          on:click={() => onPageChange(totalPages)}
          title="Last Page"
        >
          »
        </button>
      </div>
    </div>
  {/if}
</div>
