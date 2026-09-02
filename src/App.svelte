<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route, navigate, links } from "svelte-routing";
  import { initializeAuth } from "./stores/auth";
  import Dashboard from "./pages/Dashboard.svelte";
  import Users from "./pages/Users.svelte";
  import Topics from "./pages/Topics.svelte";
  import GenerateQuestions from "./pages/GenerateQuestions.svelte";
  import Login from "./pages/Login.svelte";
  import Landing from "./pages/Landing.svelte";

  export let url = "";

  onMount(() => {
    initializeAuth();
  });

  // Simple reactive guard logic instead of wrap
  let currentPath = window.location.pathname;

  $: {
    const token = localStorage.getItem("token");
    if (currentPath === "/login" && token) {
      navigate("/dashboard", { replace: true });
    } else if (
      ["/dashboard", "/users", "/topics", "/generate-questions"].includes(
        currentPath,
      ) &&
      !token
    ) {
      navigate("/login", { replace: true });
    }
  }
</script>

<svelte:window on:popstate={() => (currentPath = window.location.pathname)} />

<div
  class="min-h-screen bg-[#fdf5cb] text-black antialiased selection:bg-black selection:text-[#fde047]"
  use:links
>
  <Router {url}>
    <Route path="/login" component={Login} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/users" component={Users} />
    <Route path="/topics" component={Topics} />
    <Route path="/generate-questions" component={GenerateQuestions} />
    <Route path="/" component={Landing} />
    <!-- Catch all -->
    <Route path="*">
      <Landing />
    </Route>
  </Router>
</div>
