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

<Layout title="Generate Questions">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Generator Form Card -->
    <div
      class="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 h-fit"
    >
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">AI Question Generator</h2>
        <p class="text-sm text-gray-500 mt-1">
          Generate quiz questions automatically from a selected topic or an
          uploaded PDF document.
        </p>
      </div>

      {#if error}
        <div
          class="mb-5 p-4 bg-red-600-light border border-red-200 text-red-600 text-sm rounded-xl flex items-center space-x-2"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      {/if}

      {#if success}
        <div
          class="mb-5 p-4 bg-green-600-light border border-green-200 text-green-600 text-sm rounded-xl flex items-center space-x-2"
        >
          <span>✅</span>
          <span>{success}</span>
        </div>
      {/if}

      <form on:submit|preventDefault={handleGenerate} class="space-y-5">
        <div>
          <label
            for="topic"
            class="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Select Topic <span class="text-red-500">*</span>
          </label>
          <select
            id="topic"
            bind:value={selectedTopicId}
            required
            class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
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
            class="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Number of Questions <span class="text-red-500">*</span>
          </label>
          <input
            id="num-questions"
            type="number"
            bind:value={numQuestions}
            min="1"
            max="50"
            required
            class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
          <span class="text-xs text-gray-400 mt-1 block"
            >Between 1 and 50 questions</span
          >
        </div>

        <div>
          <label
            for="file"
            class="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Upload PDF File <span class="text-xs font-normal text-gray-400"
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
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600-light file:text-blue-600 hover:file:bg-blue-600 hover:file:text-white file:cursor-pointer file:transition-all border border-gray-300 rounded-lg bg-gray-50 p-1"
            />
          </div>
          <span class="text-xs text-gray-400 mt-1 block"
            >Maximum file size: 10MB (PDF only)</span
          >
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-600-hover disabled:opacity-60 text-white font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {#if loading}
            <svg
              class="animate-spin h-5 w-5 text-white"
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
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
        >
          <div
            class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100"
          >
            <h2 class="text-xl font-bold text-gray-900">
              Generated Results ({generatedQuestions.length})
            </h2>
            <span
              class="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full"
            >
              Success
            </span>
          </div>

          <div class="space-y-4">
            {#each generatedQuestions as question, idx}
              <div
                class="p-5 bg-gray-50 border-l-4 border-blue-600 rounded-r-xl space-y-3"
              >
                <div class="flex items-start space-x-3">
                  <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5"
                  >
                    {idx + 1}
                  </span>
                  <p
                    class="text-sm font-semibold text-gray-900 leading-relaxed"
                  >
                    {question.text}
                  </p>
                </div>

                {#if question.options}
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                    {#each question.options as option, optIdx}
                      <div
                        class="flex items-start space-x-2 p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
                      >
                        <span class="font-bold text-blue-600">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{option}</span>
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if question.answer}
                  <div class="pl-10">
                    <div
                      class="p-3 bg-green-600-light border border-green-200 rounded-lg text-xs text-green-900 flex items-center space-x-2"
                    >
                      <span class="font-bold">Correct Answer:</span>
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
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]"
        >
          <span class="text-5xl mb-4">💡</span>
          <h3 class="text-lg font-bold text-gray-800 mb-1">
            No Questions Generated Yet
          </h3>
          <p class="text-sm text-gray-500 max-w-sm">
            Select a topic on the left and click "Generate Questions" to create
            AI-powered quizzes.
          </p>
        </div>
      {/if}
    </div>
  </div>
</Layout>
