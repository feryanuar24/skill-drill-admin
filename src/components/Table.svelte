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

<div
  class="bg-white rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden"
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
        There are no records to display at this moment.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-[#fde047] border-b-3 border-black text-xs font-black text-black uppercase tracking-wider"
          >
            {#each columns as col}
              <th class="py-4 px-4 sm:px-6" style:width={col.width || "auto"}>
                {col.label}
              </th>
            {/each}
            <th class="py-4 px-4 sm:px-6 text-right w-44">Actions</th>
          </tr>
        </thead>
        <tbody
          class="divide-y-2 divide-black/10 text-xs sm:text-sm font-semibold text-black"
        >
          {#each rows as row}
            <tr class="hover:bg-[#fef9c3]/50 transition-colors">
              {#each columns as col}
                <td class="py-4 px-4 sm:px-6">
                  {row[col.key] !== undefined && row[col.key] !== null
                    ? row[col.key]
                    : "-"}
                </td>
              {/each}
              <td class="py-4 px-4 sm:px-6 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    class="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#38bdf8] hover:bg-[#0284c7] hover:text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    on:click={() => onEdit(row)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
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
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
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
</div>
