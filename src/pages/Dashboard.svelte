<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "../components/Layout.svelte";
  import apiClient from "../api/client";
  import { currentUser } from "../stores/auth";
  import { link } from "../stores/routerCompat";

  let userCount = 0;
  let topicCount = 0;
  let loading = true;

  onMount(async () => {
    try {
      const [usersResult, topicsResult] = await Promise.allSettled([
        apiClient.getUsers(),
        apiClient.getTopics(),
      ]);
      if (usersResult.status === "fulfilled") {
        userCount = usersResult.value.length;
      }
      if (topicsResult.status === "fulfilled") {
        topicCount = topicsResult.value.length;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<Layout title="Dashboard">
  <!-- Welcome Banner -->
  <div
    class="mb-8 p-6 md:p-8 bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/20"
  >
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl md:text-3xl font-bold">
          Welcome back, {$currentUser?.username || "Admin"}! 👋
        </h2>
        <p class="text-white/80 mt-1 text-sm md:text-base">
          Here is an overview of the Skill Drill platform metrics and quick
          actions.
        </p>
      </div>
      <div>
        <a
          href="/generate-questions"
          use:link
          class="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer text-sm"
        >
          <span>✨</span>
          <span>Generate Questions</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Metric Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Users Card -->
    <div
      class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Total Users
        </p>
        <p class="text-3xl font-extrabold text-gray-900 mt-2">
          {loading ? "..." : userCount}
        </p>
        <a
          href="/users"
          use:link
          class="inline-flex items-center text-xs font-medium text-blue-600 hover:underline mt-3"
        >
          Manage Users &rarr;
        </a>
      </div>
      <div
        class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl"
      >
        👥
      </div>
    </div>

    <!-- Topics Card -->
    <div
      class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Active Topics
        </p>
        <p class="text-3xl font-extrabold text-gray-900 mt-2">
          {loading ? "..." : topicCount}
        </p>
        <a
          href="/topics"
          use:link
          class="inline-flex items-center text-xs font-medium text-blue-600 hover:underline mt-3"
        >
          Manage Topics &rarr;
        </a>
      </div>
      <div
        class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl"
      >
        📚
      </div>
    </div>

    <!-- AI Generator Card -->
    <div
      class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          AI Question Engine
        </p>
        <p class="text-3xl font-extrabold text-gray-900 mt-2">Ready</p>
        <a
          href="/generate-questions"
          use:link
          class="inline-flex items-center text-xs font-medium text-blue-600 hover:underline mt-3"
        >
          Create Quizzes &rarr;
        </a>
      </div>
      <div
        class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl"
      >
        ❓
      </div>
    </div>
  </div>

  <!-- Quick Shortcuts -->
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <a
        href="/users"
        use:link
        class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-600-light hover:border-blue-600/30 transition-all flex items-start space-x-3 group"
      >
        <span class="text-2xl">👥</span>
        <div>
          <h4
            class="font-semibold text-gray-800 group-hover:text-blue-600 text-sm"
          >
            User Management
          </h4>
          <p class="text-xs text-gray-500 mt-0.5">
            Add, edit, or remove platform users.
          </p>
        </div>
      </a>

      <a
        href="/topics"
        use:link
        class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-600-light hover:border-blue-600/30 transition-all flex items-start space-x-3 group"
      >
        <span class="text-2xl">📚</span>
        <div>
          <h4
            class="font-semibold text-gray-800 group-hover:text-blue-600 text-sm"
          >
            Topic Management
          </h4>
          <p class="text-xs text-gray-500 mt-0.5">
            Organize learning subjects and categories.
          </p>
        </div>
      </a>

      <a
        href="/generate-questions"
        use:link
        class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-600-light hover:border-blue-600/30 transition-all flex items-start space-x-3 group"
      >
        <span class="text-2xl">❓</span>
        <div>
          <h4
            class="font-semibold text-gray-800 group-hover:text-blue-600 text-sm"
          >
            Question Generator
          </h4>
          <p class="text-xs text-gray-500 mt-0.5">
            Generate quiz questions from topics or PDF documents.
          </p>
        </div>
      </a>
    </div>
  </div>
</Layout>
