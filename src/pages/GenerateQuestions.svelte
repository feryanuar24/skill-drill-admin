<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import apiClient, { type Topic } from "../api/client";

  let topics: Topic[] = [];
  let selectedTopicId: number | null = null;
  let numQuestions = 5;
  let selectedFile: File | null = null;
  let loading = false;
  let error = "";
  let success = "";
  let generatedQuestions: any[] = [];

  onMount(async () => {
    await loadTopics();
  });

  async function loadTopics() {
    try {
      topics = await apiClient.getTopics();
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to load topics";
    }
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (!file.name.endsWith(".pdf")) {
        error = "Only PDF files are allowed";
        selectedFile = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        error = "File size must be less than 10MB";
        selectedFile = null;
        return;
      }
      selectedFile = file;
      error = "";
    }
  }

  async function handleGenerate() {
    error = "";
    success = "";
    generatedQuestions = [];

    if (!selectedTopicId) {
      error = "Please select a topic";
      return;
    }

    if (numQuestions < 1 || numQuestions > 50) {
      error = "Number of questions must be between 1 and 50";
      return;
    }

    loading = true;

    try {
      const result = await apiClient.generateQuestions(
        selectedTopicId,
        numQuestions,
        selectedFile || undefined,
      );

      generatedQuestions = result.questions || [];
      success = `Successfully generated ${generatedQuestions.length} questions!`;
      selectedFile = null;
    } catch (err: any) {
      error = err.response?.data?.message || "Failed to generate questions";
    } finally {
      loading = false;
    }
  }
</script>

<Layout title="AI Question Generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Generator Form Card -->
    <div
      class="lg:col-span-5 bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 sm:p-8 h-fit relative overflow-hidden"
    >
      <div class="mb-6">
        <div
          class="inline-block bg-[#fde047] border-2 border-black px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black mb-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          AI Tool
        </div>
        <h2 class="text-xl font-black uppercase tracking-tight text-black">
          Generate Questions
        </h2>
        <p class="text-xs sm:text-sm font-bold text-black/70 mt-1">
          Generate quiz questions automatically from a selected topic or an
          uploaded PDF document.
        </p>
      </div>

      {#if error}
        <div
          class="mb-5 p-3.5 bg-[#ffe4e6] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
        >
          <span class="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      {/if}

      {#if success}
        <div
          class="mb-5 p-3.5 bg-[#bbf7d0] border-3 border-black text-black text-xs sm:text-sm font-bold rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center space-x-2.5"
        >
          <span class="text-lg">✅</span>
          <span>{success}</span>
        </div>
      {/if}

      <form on:submit|preventDefault={handleGenerate} class="space-y-4">
        <div>
          <label
            for="topic"
            class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >
            Select Topic <span class="text-rose-500">*</span>
          </label>
          <select
            id="topic"
            bind:value={selectedTopicId}
            required
            class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <option value={null}>-- Choose a topic --</option>
            {#each topics as topic}
              <option value={topic.id}>{topic.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="num-questions"
            class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >
            Number of Questions <span class="text-rose-500">*</span>
          </label>
          <input
            id="num-questions"
            type="number"
            bind:value={numQuestions}
            min="1"
            max="50"
            required
            class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
          />
          <span class="text-[11px] font-bold text-black/50 mt-1 block"
            >Between 1 and 50 questions</span
          >
        </div>

        <div>
          <label
            for="file"
            class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
          >
            Upload PDF File <span class="text-[10px] font-normal text-black/50"
              >(Optional)</span
            >
          </label>
          <div class="relative">
            <input
              id="file"
              type="file"
              accept=".pdf"
              on:change={handleFileChange}
              disabled={loading}
              class="block w-full text-xs font-bold text-black file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-2 file:border-black file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-[#fde047] hover:file:bg-[#facc15] file:text-black file:cursor-pointer file:shadow-[2px_2px_0px_rgba(0,0,0,1)] border-2 border-black rounded-xl bg-[#fef9c3]/20 p-2 cursor-pointer"
            />
          </div>
          <span class="text-[11px] font-bold text-black/50 mt-1 block"
            >Maximum file size: 10MB (PDF only)</span
          >
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full mt-2 py-3.5 px-4 bg-[#fde047] hover:bg-[#facc15] disabled:opacity-60 border-3 border-black text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {#if loading}
            <svg
              class="animate-spin h-5 w-5 text-black"
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
            <span>Generating Questions...</span>
          {:else}
            <span>✨ Generate Questions</span>
          {/if}
        </button>
      </form>
    </div>

    <!-- Results Card -->
    <div class="lg:col-span-7">
      {#if generatedQuestions.length > 0}
        <div
          class="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 sm:p-8"
        >
          <div
            class="flex items-center justify-between mb-6 pb-4 border-b-3 border-black"
          >
            <h2
              class="text-lg sm:text-xl font-black uppercase tracking-tight text-black"
            >
              Generated Results ({generatedQuestions.length})
            </h2>
            <span
              class="text-xs font-black uppercase tracking-wider px-3 py-1 bg-[#86efac] text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              Ready
            </span>
          </div>

          <div class="space-y-4">
            {#each generatedQuestions as question, idx}
              <div
                class="p-5 bg-[#fef9c3]/30 border-3 border-black rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] space-y-3"
              >
                <div class="flex items-start space-x-3">
                  <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fde047] border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0 mt-0.5"
                  >
                    {idx + 1}
                  </span>
                  <p class="text-sm font-bold text-black leading-relaxed">
                    {question.text}
                  </p>
                </div>

                {#if question.options}
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                    {#each question.options as option, optIdx}
                      <div
                        class="flex items-start space-x-2 p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-bold text-black"
                      >
                        <span
                          class="font-black text-black bg-[#fde047] px-1.5 py-0.5 rounded border border-black text-[10px]"
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if question.answer}
                  <div class="pl-10">
                    <div
                      class="p-3 bg-[#bbf7d0] border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-bold text-black flex items-center space-x-2"
                    >
                      <span
                        class="font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded text-[10px]"
                        >Correct Answer:</span
                      >
                      <span>{question.answer}</span>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div
          class="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-8 sm:p-12 text-center flex flex-col items-center justify-center h-full min-h-85"
        >
          <div
            class="w-16 h-16 bg-[#fde047] border-3 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl mb-4 transform -rotate-3"
          >
            ✨
          </div>
          <h3
            class="text-base sm:text-lg font-black uppercase tracking-tight text-black mb-1"
          >
            No Questions Generated Yet
          </h3>
          <p class="text-xs sm:text-sm font-bold text-black/60 max-w-sm">
            Select a topic on the left and click "Generate Questions" to create
            AI-powered quizzes.
          </p>
        </div>
      {/if}
    </div>
  </div>
</Layout>
