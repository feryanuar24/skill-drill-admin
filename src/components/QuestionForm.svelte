<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Question, Topic, CreateQuestionRequest } from "../api/client";

  const dispatch = createEventDispatcher();

  export let question: Question | null = null;
  export let topics: Topic[] = [];

  let formData: CreateQuestionRequest = {
    topic_id: topics.length > 0 ? topics[0].id : 0,
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    explanation: "",
  };

  let errors: Record<string, string> = {};
  let currentQuestionId: number | null = null;

  $: if (question) {
    if (question.id !== currentQuestionId) {
      currentQuestionId = question.id;
      formData = {
        topic_id: question.topic_id,
        question_text: question.question_text || "",
        option_a: question.option_a || "",
        option_b: question.option_b || "",
        option_c: question.option_c || "",
        option_d: question.option_d || "",
        correct_answer: question.correct_answer?.toUpperCase() || "A",
        explanation: question.explanation || "",
      };
    }
  } else if (currentQuestionId !== null) {
    currentQuestionId = null;
    formData = {
      topic_id: topics.length > 0 ? topics[0].id : 0,
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
      explanation: "",
    };
  }

  function validateForm(): boolean {
    errors = {};

    if (!formData.topic_id || formData.topic_id === 0) {
      errors.topic_id = "Please select a topic";
    }

    if (!formData.question_text.trim()) {
      errors.question_text = "Question text is required";
    } else if (formData.question_text.trim().length < 5) {
      errors.question_text = "Question text must be at least 5 characters";
    }

    if (!formData.option_a.trim()) {
      errors.option_a = "Option A is required";
    }

    if (!formData.option_b.trim()) {
      errors.option_b = "Option B is required";
    }

    if (!formData.option_c.trim()) {
      errors.option_c = "Option C is required";
    }

    if (!formData.option_d.trim()) {
      errors.option_d = "Option D is required";
    }

    if (!formData.correct_answer) {
      errors.correct_answer = "Please select the correct answer";
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    dispatch("submit", {
      ...formData,
      topic_id: Number(formData.topic_id),
      correct_answer: formData.correct_answer.toUpperCase(),
    });
  }

  function handleClose() {
    dispatch("close");
  }
</script>

<div
  class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 selection:bg-black selection:text-[#fde047] overflow-y-auto"
  on:click={handleClose}
  role="presentation"
>
  <div
    class="bg-white rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black w-full max-w-2xl my-8 overflow-hidden relative"
    on:click|stopPropagation
    role="presentation"
  >
    <!-- Modal Header -->
    <div
      class="flex items-center justify-between px-6 py-4 bg-[#fdf5cb] border-b-3 border-black"
    >
      <div class="flex items-center space-x-2.5">
        <span
          class="w-8 h-8 bg-[#fde047] border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-sm font-black"
        >
          ❓
        </span>
        <h2 class="text-lg font-black uppercase tracking-tight text-black">
          {question ? "Edit Question" : "Add New Question"}
        </h2>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black font-black text-sm leading-none transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        on:click={handleClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <!-- Modal Form -->
    <form
      on:submit|preventDefault={handleSubmit}
      class="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
    >
      <!-- Topic Selector -->
      <div>
        <label
          for="topic_id"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Topic <span class="text-rose-500">*</span>
        </label>
        <select
          id="topic_id"
          bind:value={formData.topic_id}
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer {errors.topic_id
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        >
          <option value={0} disabled>-- Select a Topic --</option>
          {#each topics as topic}
            <option value={topic.id}>{topic.name}</option>
          {/each}
        </select>
        {#if errors.topic_id}
          <p class="mt-1 text-xs font-bold text-rose-600">{errors.topic_id}</p>
        {/if}
      </div>

      <!-- Question Text -->
      <div>
        <label
          for="question_text"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Question Text <span class="text-rose-500">*</span>
        </label>
        <textarea
          id="question_text"
          bind:value={formData.question_text}
          placeholder="Enter the question or problem prompt..."
          rows="3"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.question_text
            ? 'border-rose-500 bg-rose-50'
            : ''}"
        />
        {#if errors.question_text}
          <p class="mt-1 text-xs font-bold text-rose-600">
            {errors.question_text}
          </p>
        {/if}
      </div>

      <!-- Multiple Choice Options -->
      <div class="space-y-3">
        <span
          class="block text-xs font-black uppercase tracking-wider text-black"
        >
          Answer Options <span class="text-rose-500">*</span>
        </span>

        <!-- Option A -->
        <div>
          <div class="flex items-center space-x-2">
            <label
              for="option_a"
              class="w-8 h-8 rounded-lg bg-[#fde047] border-2 border-black flex items-center justify-center text-xs font-black shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              A
            </label>
            <input
              id="option_a"
              type="text"
              bind:value={formData.option_a}
              placeholder="Option A text"
              class="flex-1 px-3.5 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.option_a
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
          </div>
          {#if errors.option_a}
            <p class="mt-1 ml-10 text-xs font-bold text-rose-600">
              {errors.option_a}
            </p>
          {/if}
        </div>

        <!-- Option B -->
        <div>
          <div class="flex items-center space-x-2">
            <label
              for="option_b"
              class="w-8 h-8 rounded-lg bg-[#fde047] border-2 border-black flex items-center justify-center text-xs font-black shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              B
            </label>
            <input
              id="option_b"
              type="text"
              bind:value={formData.option_b}
              placeholder="Option B text"
              class="flex-1 px-3.5 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.option_b
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
          </div>
          {#if errors.option_b}
            <p class="mt-1 ml-10 text-xs font-bold text-rose-600">
              {errors.option_b}
            </p>
          {/if}
        </div>

        <!-- Option C -->
        <div>
          <div class="flex items-center space-x-2">
            <label
              for="option_c"
              class="w-8 h-8 rounded-lg bg-[#fde047] border-2 border-black flex items-center justify-center text-xs font-black shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              C
            </label>
            <input
              id="option_c"
              type="text"
              bind:value={formData.option_c}
              placeholder="Option C text"
              class="flex-1 px-3.5 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.option_c
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
          </div>
          {#if errors.option_c}
            <p class="mt-1 ml-10 text-xs font-bold text-rose-600">
              {errors.option_c}
            </p>
          {/if}
        </div>

        <!-- Option D -->
        <div>
          <div class="flex items-center space-x-2">
            <label
              for="option_d"
              class="w-8 h-8 rounded-lg bg-[#fde047] border-2 border-black flex items-center justify-center text-xs font-black shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              D
            </label>
            <input
              id="option_d"
              type="text"
              bind:value={formData.option_d}
              placeholder="Option D text"
              class="flex-1 px-3.5 py-2 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all {errors.option_d
                ? 'border-rose-500 bg-rose-50'
                : ''}"
            />
          </div>
          {#if errors.option_d}
            <p class="mt-1 ml-10 text-xs font-bold text-rose-600">
              {errors.option_d}
            </p>
          {/if}
        </div>
      </div>

      <!-- Correct Answer Selection -->
      <div>
        <span
          class="block text-xs font-black uppercase tracking-wider text-black mb-2"
        >
          Correct Answer <span class="text-rose-500">*</span>
        </span>
        <div class="grid grid-cols-4 gap-2.5">
          {#each ["A", "B", "C", "D"] as opt}
            <button
              type="button"
              class="py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 {formData.correct_answer ===
              opt
                ? 'bg-[#86efac] text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] scale-[1.02]'
                : 'bg-white hover:bg-gray-100 text-black/70 shadow-[2px_2px_0px_rgba(0,0,0,1)]'}"
              on:click={() => (formData.correct_answer = opt)}
            >
              <span class="text-sm"
                >{formData.correct_answer === opt ? "✓" : ""}</span
              >
              <span>Option {opt}</span>
            </button>
          {/each}
        </div>
        {#if errors.correct_answer}
          <p class="mt-1 text-xs font-bold text-rose-600">
            {errors.correct_answer}
          </p>
        {/if}
      </div>

      <!-- Explanation -->
      <div>
        <label
          for="explanation"
          class="block text-xs font-black uppercase tracking-wider text-black mb-1.5"
        >
          Explanation <span class="text-[10px] font-normal text-black/50"
            >(Optional)</span
          >
        </label>
        <textarea
          id="explanation"
          bind:value={formData.explanation}
          placeholder="Explain why the correct answer is right..."
          rows="3"
          class="w-full px-3.5 py-2.5 bg-[#fef9c3]/30 focus:bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
        />
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black/10"
      >
        <button
          type="button"
          class="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-gray-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
          on:click={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-[#fde047] hover:bg-[#facc15] rounded-xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
        >
          {question ? "Save Changes" : "Create Question"}
        </button>
      </div>
    </form>
  </div>
</div>
