<script lang="ts">
  import { onMount } from "svelte";
  import { isLoggedIn } from "./stores/auth";
  import { currentPage, navigate, getCurrentRoute } from "./stores/router";
  import Sidebar from "./components/Sidebar.svelte";
  import Layout from "./components/Layout.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Users from "./pages/Users.svelte";
  import Topics from "./pages/Topics.svelte";
  import GenerateQuestions from "./pages/GenerateQuestions.svelte";
  import Login from "./pages/Login.svelte";
  import Landing from "./pages/Landing.svelte";

  let pageComponent: any;
  let pageTitle: string = "";

  onMount(() => {
    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      const newRoute = getCurrentRoute();
      currentPage.set(newRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });

  // Guard routing logic
  $: {
    if (!$isLoggedIn) {
      if ($currentPage !== "login" && $currentPage !== "home") {
        navigate("login");
      }
    } else {
      if ($currentPage === "login") {
        navigate("dashboard");
      }
    }
  }

  $: {
    switch ($currentPage) {
      case "users":
        pageComponent = Users;
        pageTitle = "Users";
        break;
      case "topics":
        pageComponent = Topics;
        pageTitle = "Topics";
        break;
      case "generate-questions":
        pageComponent = GenerateQuestions;
        pageTitle = "Generate Questions";
        break;
      case "login":
        pageComponent = Login;
        pageTitle = "Login";
        break;
      case "home":
        pageComponent = Landing;
        pageTitle = "Welcome";
        break;
      case "dashboard":
      default:
        pageComponent = Dashboard;
        pageTitle = "Dashboard";
        break;
    }
  }
</script>

<div class="app">
  {#if $isLoggedIn && $currentPage !== "login" && $currentPage !== "home"}
    <Sidebar />
    <Layout title={pageTitle}>
      <svelte:component this={pageComponent} />
    </Layout>
  {:else}
    <svelte:component this={pageComponent} />
  {/if}
</div>

<style>
  :global(:root) {
    --primary: #3366cc;
    --secondary: #8899dd;
    --danger: #dd3333;
    --success: #33aa33;
    --warning: #ffaa00;
    --text: #333333;
    --bg: #f5f5f5;
    --border: #dddddd;
    --radius: 8px;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    background-color: var(--bg);
    color: var(--text);
  }

  .app {
    min-height: 100vh;
    background-color: var(--bg);
  }
</style>
