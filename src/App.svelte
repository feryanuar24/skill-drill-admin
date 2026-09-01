<script lang="ts">
  import { onMount } from "svelte";
  import Router, { replace } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import { initializeAuth } from "./stores/auth";
  import Dashboard from "./pages/Dashboard.svelte";
  import Users from "./pages/Users.svelte";
  import Topics from "./pages/Topics.svelte";
  import GenerateQuestions from "./pages/GenerateQuestions.svelte";
  import Login from "./pages/Login.svelte";
  import Landing from "./pages/Landing.svelte";

  onMount(() => {
    initializeAuth();
  });

  function requireAuth(): boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      replace("/login");
      return false;
    }
    return true;
  }

  function redirectIfAuth(): boolean {
    const token = localStorage.getItem("token");
    if (token) {
      replace("/dashboard");
      return false;
    }
    return true;
  }

  const routes = {
    "/": Landing,
    "/login": wrap({
      component: Login,
      conditions: [redirectIfAuth],
    }),
    "/dashboard": wrap({
      component: Dashboard,
      conditions: [requireAuth],
    }),
    "/users": wrap({
      component: Users,
      conditions: [requireAuth],
    }),
    "/topics": wrap({
      component: Topics,
      conditions: [requireAuth],
    }),
    "/generate-questions": wrap({
      component: GenerateQuestions,
      conditions: [requireAuth],
    }),
    "*": Landing,
  };
</script>

<div class="min-h-screen bg-gray-100 text-gray-800 antialiased">
  <Router {routes} />
</div>
