<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import apiClient, { type Question, type Topic } from "../api/client";
  import { formatDateTime } from "../utils/helpers";
  import { link } from "../stores/routerCompat";
  import QuestionForm from "../components/QuestionForm.svelte";

  let questions: Question[] = [];
  let topics: Topic[] = [];
  let loading = false;
  let error = "";
  let success = "";

  let showForm = false;
  let editingQuestion: Question | null = null;

  // Filters
  let selectedTopicId: number | "all" = "all";
  let searchQuery = "";

  onMount(async () => {
    await Promise.all([loadTopics(), loadQuestions()]);
  });

  async function loadTopics() {
    try {
      topics = await apiClient.getTopics();
    } catch (err: any) {
      console.error("Failed to load topics:", err);
    }
  }

  async function loadQuestions() {
    loading = true;
    error = "";
    try {
      const topicId =
        selectedTopicId === "all" ? undefined : Number(selectedTopicId);
      questions = await apiClient.getQuestions(topicId, searchQuery);
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to load questions";
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    loadQuestions();
  }

  function handleClearFilters() {
    selectedTopicId = "all";
    searchQuery = "";
    loadQuestions();
  }

  function handleAddNew() {
    editingQuestion = null;
    showForm = true;
  }

  function handleEdit(q: Question) {
    editingQuestion = q;
    showForm = true;
  }

  function handleFormClose() {
    showForm = false;
    editingQuestion = null;
  }

  async function handleFormSubmit(e: CustomEvent) {
    const formData = e.detail;
    error = "";
    success = "";

    try {
      if (editingQuestion) {
        const updated = await apiClient.updateQuestion(
          editingQuestion.id,
          formData,
        );
        // Retain topic name from topic list if not populated
        if (!updated.topic && topics.length > 0) {
          updated.topic = topics.find((t) => t.id === updated.topic_id);
        }
        questions = questions.map((q) => (q.id === updated.id ? updated : q));
        success = "Question updated successfully!";
      } else {
        const created = await apiClient.createQuestion(formData);
        if (!created.topic && topics.length > 0) {
          created.topic = topics.find((t) => t.id === created.topic_id);
        }
        questions = [created, ...questions];
        success = "Question created successfully!";
      }
      handleFormClose();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to save question";
    }
  }

  async function handleDelete(q: Question) {
    const snippet =
      q.question_text.length > 40
        ? q.question_text.slice(0, 40) + "..."
        : q.question_text;
    if (!confirm(`Are you sure you want to delete question "${snippet}"?`)) {
      return;
    }

    error = "";
    success = "";
    try {
      await apiClient.deleteQuestion(q.id);
      questions = questions.filter((item) => item.id !== q.id);
      success = "Question deleted successfully!";
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to delete question";
    }
  }

  function getTopicName(topicId: number, topic?: Topic): string {
    if (topic?.name) return topic.name;
    const found = topics.find((t) => t.id === topicId);
    return found ? found.name : `Topic #${topicId}`;
  }
</script>

<Layout title="Questions Management">
  <!-- Top Banner & Action Controls -->
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-white border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]"
  >
    <div>
      <div
        class="inline-block bg-[#fed7aa] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black mb-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
      >
        Question Bank
      </div>
      <p class="text-xs sm:text-sm font-bold text-black/80">
        Create, review, edit, and organize multiple choice questions across all
        subjects.
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/generate-questions"
        use:link
        class="inline-flex items-center space-x-2 px-4 py-3 bg-[#bbf7d0] hover:bg-[#86efac] text-black text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </span>
        <span>AI Generator</span>
      </a>

      <button
        class="inline-flex items-center space-x-2 px-4 py-3 bg-[#fde047] hover:bg-[#facc15] text-black text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
        on:click={handleAddNew}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.2"
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
        <span>Add Question</span>
      </button>
    </div>
  </div>

  <!-- Status / Error Messages -->
  {#if error}
    <div
      class="mb-6 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
    >
      <span>
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

  <!-- Filters & Search Bar -->
  <div
    class="bg-white rounded-2xl border-4 border-black p-4 mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
  >
    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1"
    >
      <!-- Topic Filter -->
      <div class="sm:w-60">
        <label for="filter-topic" class="sr-only">Filter by Topic</label>
        <select
          id="filter-topic"
          bind:value={selectedTopicId}
          on:change={handleFilterChange}
          class="w-full px-3 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          <option value="all">📁 All Topics ({topics.length})</option>
          {#each topics as topic}
            <option value={topic.id}>{topic.name}</option>
          {/each}
        </select>
      </div>

      <!-- Search Box -->
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleFilterChange}
          placeholder="Search question text or explanations..."
          class="w-full pl-9 pr-4 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
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
      </div>
    </div>

    <div
      class="flex items-center justify-between sm:justify-end gap-2 shrink-0"
    >
      <span
        class="text-[11px] font-black uppercase tracking-wider bg-[#fdf5cb] border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
      >
        Total: {questions.length}
      </span>
      {#if selectedTopicId !== "all" || searchQuery}
        <button
          class="text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
          on:click={handleClearFilters}
        >
          Reset
        </button>
      {/if}
    </div>
  </div>

  <!-- Form Modal -->
  {#if showForm}
    <QuestionForm
      question={editingQuestion}
      {topics}
      on:submit={handleFormSubmit}
      on:close={handleFormClose}
    />
  {/if}

  <!-- Questions Display List -->
  {#if loading}
    <div
      class="bg-white rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] border-4 border-black py-16 flex flex-col items-center justify-center text-black space-y-3"
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
        >Loading questions...</span
      >
    </div>
  {:else if questions.length === 0}
    <div
      class="bg-white rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] border-4 border-black py-16 px-4 flex flex-col items-center justify-center text-center space-y-3"
    >
      <span
        class="text-4xl p-4 bg-[#fdf5cb] border-3 border-black rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-2"
      >
        📝
      </span>
      <h3 class="text-base font-black uppercase text-black">
        {selectedTopicId !== "all" || searchQuery
          ? "No matching questions found"
          : "No questions in the question bank yet"}
      </h3>
      <p class="text-xs font-bold text-black/60 max-w-md">
        {selectedTopicId !== "all" || searchQuery
          ? "Try adjusting your search query or topic filter to find what you are looking for."
          : "Start building your question library by manually creating questions or generating them with AI."}
      </p>
      <div class="flex items-center gap-3 pt-2">
        {#if selectedTopicId !== "all" || searchQuery}
          <button
            class="px-4 py-2 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
            on:click={handleClearFilters}
          >
            Clear Filters
          </button>
        {:else}
          <button
            class="px-4 py-2.5 bg-[#fde047] hover:bg-[#facc15] text-black text-xs font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer"
            on:click={handleAddNew}
          >
            + Add First Question
          </button>
          <a
            href="/generate-questions"
            use:link
            class="px-4 py-2.5 bg-[#bbf7d0] hover:bg-[#86efac] text-black text-xs font-black uppercase tracking-wider rounded-xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            AI Question Generator
          </a>
        {/if}
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      {#each questions as q, idx (q.id)}
        <div
          class="bg-white rounded-2xl border-4 border-black p-5 sm:p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] transition-all space-y-4"
        >
          <!-- Card Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black/10"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fde047] border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0"
              >
                #{q.id}
              </span>
              <span
                class="px-2.5 py-0.5 bg-[#bae6fd] border-2 border-black rounded-md text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              >
                {getTopicName(q.topic_id, q.topic)}
              </span>
              <span class="text-[11px] font-bold text-black/50">
                {formatDateTime(q.created_at)}
              </span>
            </div>

            <!-- Actions -->
            <div
              class="flex items-center space-x-2 shrink-0 self-end sm:self-auto"
            >
              <button
                class="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#38bdf8] hover:bg-[#0284c7] hover:text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center space-x-1"
                on:click={() => handleEdit(q)}
                title="Edit Question"
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
                <span>Edit</span>
              </button>

              <button
                class="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#f43f5e] hover:bg-[#e11d48] rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center space-x-1"
                on:click={() => handleDelete(q)}
                title="Delete Question"
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
                <span>Delete</span>
              </button>
            </div>
          </div>

          <!-- Question Text -->
          <div>
            <p
              class="text-sm sm:text-base font-bold text-black leading-relaxed"
            >
              {q.question_text}
            </p>
          </div>

          <!-- Options Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {#each [{ label: "A", text: q.option_a }, { label: "B", text: q.option_b }, { label: "C", text: q.option_c }, { label: "D", text: q.option_d }] as opt}
              {@const isCorrect = q.correct_answer?.toUpperCase() === opt.label}
              <div
                class="flex items-start space-x-2.5 p-3 rounded-xl border-2 border-black text-xs font-bold text-black transition-all {isCorrect
                  ? 'bg-[#bbf7d0] shadow-[3px_3px_0px_rgba(0,0,0,1)] ring-2 ring-emerald-500'
                  : 'bg-[#fef9c3]/20 shadow-[2px_2px_0px_rgba(0,0,0,1)]'}"
              >
                <span
                  class="font-black px-2 py-0.5 rounded border border-black text-[10px] shrink-0 {isCorrect
                    ? 'bg-black text-white'
                    : 'bg-[#fde047] text-black'}"
                >
                  {opt.label}
                </span>
                <span class="flex-1 wrap-break-words leading-snug"
                  >{opt.text}</span
                >
                {#if isCorrect}
                  <span
                    class="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.2 rounded border border-black shrink-0"
                  >
                    ✓ Correct
                  </span>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Explanation section if present -->
          {#if q.explanation}
            <div
              class="p-3.5 bg-[#e0f2fe] border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-bold text-black space-y-1"
            >
              <div class="flex items-center space-x-1.5">
                <span
                  class="font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded text-[10px]"
                >
                  Explanation
                </span>
              </div>
              <p class="text-black/80 font-medium leading-relaxed mt-1">
                {q.explanation}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Layout>
