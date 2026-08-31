<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import apiClient, { type Topic } from "../api/client";
  import { formatDateTime } from "../utils/helpers";

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
  <div class="container">
    <div class="form-card">
      <h2>Generate Questions from PDF or Text</h2>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      {#if success}
        <div class="success-message">{success}</div>
      {/if}

      <form on:submit|preventDefault={handleGenerate}>
        <div class="form-group">
          <label for="topic">Select Topic *</label>
          <select id="topic" bind:value={selectedTopicId} required>
            <option value={null}>-- Choose a topic --</option>
            {#each topics as topic}
              <option value={topic.id}>{topic.name}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="num-questions">Number of Questions *</label>
          <input
            id="num-questions"
            type="number"
            bind:value={numQuestions}
            min="1"
            max="50"
            required
          />
          <small>Between 1 and 50 questions</small>
        </div>

        <div class="form-group">
          <label for="file">Upload PDF File (Optional)</label>
          <div class="file-input-wrapper">
            <input
              id="file"
              type="file"
              accept=".pdf"
              on:change={handleFileChange}
              disabled={loading}
            />
            <span class="file-name">
              {selectedFile ? selectedFile.name : "No file selected"}
            </span>
          </div>
          <small>Maximum file size: 10MB</small>
        </div>

        <button type="submit" class="btn-primary" disabled={loading}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </form>
    </div>

    {#if generatedQuestions.length > 0}
      <div class="results-card">
        <h2>Generated Questions</h2>
        <div class="questions-list">
          {#each generatedQuestions as question, idx}
            <div class="question-item">
              <div class="question-number">Q{idx + 1}</div>
              <div class="question-content">
                <p class="question-text">{question.text}</p>
                {#if question.options}
                  <div class="options">
                    {#each question.options as option, optIdx}
                      <div class="option">
                        <span class="option-label"
                          >{String.fromCharCode(65 + optIdx)}.</span
                        >
                        <span>{option}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
                {#if question.answer}
                  <p class="answer">
                    <strong>Answer:</strong>
                    {question.answer}
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .form-card,
  .results-card {
    background: white;
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow);
  }

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--primary);
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text);
  }

  select,
  input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
  }

  select:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
  }

  small {
    display: block;
    margin-top: 4px;
    color: #666;
    font-size: 12px;
  }

  .file-input-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
  }

  input[type="file"] {
    position: absolute;
    left: -9999px;
  }

  input[type="file"] + .file-name {
    display: block;
    padding: 10px;
    background-color: #f5f5f5;
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    color: #666;
  }

  input[type="file"]:hover + .file-name {
    background-color: #e8e8e8;
  }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2952a3;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #ffe6e6;
    color: var(--danger);
    padding: 12px;
    border-radius: var(--radius);
    margin-bottom: 20px;
  }

  .success-message {
    background-color: #e6ffe6;
    color: var(--success);
    padding: 12px;
    border-radius: var(--radius);
    margin-bottom: 20px;
  }

  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .question-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border-left: 4px solid var(--primary);
  }

  .question-number {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background-color: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .question-content {
    flex: 1;
  }

  .question-text {
    margin: 0 0 12px 0;
    font-weight: 500;
  }

  .options {
    margin: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .option {
    display: flex;
    gap: 8px;
    padding: 8px;
    background-color: white;
    border-radius: 4px;
  }

  .option-label {
    font-weight: 600;
    color: var(--primary);
  }

  .answer {
    margin: 12px 0 0 0;
    padding: 8px;
    background-color: #e6ffe6;
    border-radius: 4px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
</style>
