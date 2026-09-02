<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import apiClient from "../api/client";
  import { currentUser } from "../stores/auth";
  import { link } from "../stores/routerCompat";

  let userCount = 0;
  let topicCount = 0;
  let questionCount = 0;
  let loading = true;

  onMount(async () => {
    try {
      const [usersResult, topicsResult, questionsResult] =
        await Promise.allSettled([
          apiClient.getUsers(),
          apiClient.getTopics(),
          apiClient.getQuestions(),
        ]);
      if (usersResult.status === "fulfilled") {
        userCount = usersResult.value.length;
      }
      if (topicsResult.status === "fulfilled") {
        topicCount = topicsResult.value.length;
      }
      if (questionsResult.status === "fulfilled") {
        questionCount = questionsResult.value.length;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<Layout title="Dashboard Overview">
  <!-- Welcome Banner -->
  <div
    class="mb-8 p-6 sm:p-8 bg-[#a78bfa] border-4 border-black rounded-2xl text-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden"
  >
    <!-- Background subtle geometric accent -->
    <div
      class="absolute inset-0 pointer-events-none opacity-10"
      style="background-image: repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 16px);"
    ></div>

    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10"
    >
      <div>
        <div
          class="inline-block bg-[#fde047] border-2 border-black px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          Overview & Metrics
        </div>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          Welcome back, {$currentUser?.username || "Admin"}!
        </h2>
        <p class="text-black font-bold mt-1 text-sm sm:text-base max-w-xl">
          Here is an overview of the Skill Drill platform metrics and quick
          management actions.
        </p>
      </div>
      <div class="shrink-0">
        <a
          href="/generate-questions"
          use:link
          class="inline-flex items-center space-x-2 bg-[#fde047] hover:bg-[#facc15] text-black font-black uppercase text-xs sm:text-sm px-5 py-3.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
        >
          <span
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </span>
          <span>Generate Questions</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Metric Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Users Card -->
    <div
      class="bg-white p-6 rounded-2xl border-4 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
    >
      <div>
        <span
          class="inline-block bg-[#bae6fd] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black"
        >
          Total Users
        </span>
        <p class="text-3xl sm:text-4xl font-black text-black mt-2">
          {loading ? "..." : userCount}
        </p>
        <a
          href="/users"
          use:link
          class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#bae6fd] hover:bg-[#7dd3fc] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        >
          <span>Manage</span>
          <span>&rarr;</span>
        </a>
      </div>
      <div
        class="w-14 h-14 bg-[#38bdf8] text-black border-3 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      </div>
    </div>

    <!-- Topics Card -->
    <div
      class="bg-white p-6 rounded-2xl border-4 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
    >
      <div>
        <span
          class="inline-block bg-[#fed7aa] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black"
        >
          Subjects
        </span>
        <p class="text-3xl sm:text-4xl font-black text-black mt-2">
          {loading ? "..." : topicCount}
        </p>
        <a
          href="/topics"
          use:link
          class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#fed7aa] hover:bg-[#fdba74] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        >
          <span>Manage</span>
          <span>&rarr;</span>
        </a>
      </div>
      <div
        class="w-14 h-14 bg-[#fb923c] text-white border-3 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      </div>
    </div>

    <!-- Questions Card -->
    <div
      class="bg-white p-6 rounded-2xl border-4 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
    >
      <div>
        <span
          class="inline-block bg-[#fde047] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black"
        >
          Total Questions
        </span>
        <p class="text-3xl sm:text-4xl font-black text-black mt-2">
          {loading ? "..." : questionCount}
        </p>
        <a
          href="/questions"
          use:link
          class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#fde047] hover:bg-[#facc15] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        >
          <span>Manage</span>
          <span>&rarr;</span>
        </a>
      </div>
      <div
        class="w-14 h-14 bg-[#fde047] text-black border-3 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
    </div>

    <!-- AI Generator Card -->
    <div
      class="bg-white p-6 rounded-2xl border-4 border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] flex items-center justify-between hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
    >
      <div>
        <span
          class="inline-block bg-[#bbf7d0] border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-black"
        >
          Question Engine
        </span>
        <p class="text-3xl sm:text-4xl font-black text-black mt-2">Ready</p>
        <a
          href="/generate-questions"
          use:link
          class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#bbf7d0] hover:bg-[#86efac] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
        >
          <span>Create Quizzes</span>
          <span>&rarr;</span>
        </a>
      </div>
      <div
        class="w-14 h-14 bg-[#86efac] text-black border-3 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      </div>
    </div>
  </div>

  <!-- Quick Shortcuts -->
  <div
    class="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 sm:p-8"
  >
    <div class="flex items-center justify-between mb-5">
      <h3
        class="text-lg sm:text-xl font-black uppercase tracking-tight text-black"
      >
        Quick Shortcuts
      </h3>
      <span
        class="text-xs font-bold uppercase bg-[#fde047] border-2 border-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]"
      >
        Admin Controls
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <a
        href="/users"
        use:link
        class="p-4 rounded-xl border-3 border-black bg-[#fdf5cb] hover:bg-[#bae6fd] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-start space-x-3.5 group cursor-pointer"
      >
        <span
          class="text-2xl p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </span>
        <div>
          <h4 class="font-black text-black text-sm uppercase tracking-tight">
            User Management
          </h4>
          <p class="text-xs font-semibold text-black/70 mt-1">
            Add, edit, or remove platform students and admins.
          </p>
        </div>
      </a>

      <a
        href="/topics"
        use:link
        class="p-4 rounded-xl border-3 border-black bg-[#fdf5cb] hover:bg-[#fed7aa] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-start space-x-3.5 group cursor-pointer"
      >
        <span
          class="text-2xl p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
        </span>
        <div>
          <h4 class="font-black text-black text-sm uppercase tracking-tight">
            Topic Management
          </h4>
          <p class="text-xs font-semibold text-black/70 mt-1">
            Organize learning subjects, topics, and categories.
          </p>
        </div>
      </a>

      <a
        href="/questions"
        use:link
        class="p-4 rounded-xl border-3 border-black bg-[#fdf5cb] hover:bg-[#fde047] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-start space-x-3.5 group cursor-pointer"
      >
        <span
          class="text-2xl p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </span>
        <div>
          <h4 class="font-black text-black text-sm uppercase tracking-tight">
            Question Bank
          </h4>
          <p class="text-xs font-semibold text-black/70 mt-1">
            Browse, create, edit, and organize quiz questions.
          </p>
        </div>
      </a>

      <a
        href="/generate-questions"
        use:link
        class="p-4 rounded-xl border-3 border-black bg-[#fdf5cb] hover:bg-[#bbf7d0] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-start space-x-3.5 group cursor-pointer"
      >
        <span
          class="text-2xl p-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </span>
        <div>
          <h4 class="font-black text-black text-sm uppercase tracking-tight">
            AI Generator
          </h4>
          <p class="text-xs font-semibold text-black/70 mt-1">
            Generate questions automatically with AI.
          </p>
        </div>
      </a>
    </div>
  </div>
</Layout>
