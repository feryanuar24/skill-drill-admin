<script lang="ts">
  import { onMount } from "svelte";
  import apiClient, { type LoginResponse } from "../api/client";
  import { login } from "../stores/auth";
  import { navigate } from "../stores/router";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleLogin() {
    error = "";
    loading = true;

    try {
      const response: LoginResponse = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      login(response.token, response.user);
      navigate("/dashboard");
    } catch (err: any) {
      error = err.response?.data?.message || "Login failed. Please try again.";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1>Admin Dashboard</h1>
    <p class="subtitle">Skill Drill Management</p>

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="admin@example.com"
          required
          on:keypress={handleKeyPress}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          on:keypress={handleKeyPress}
        />
      </div>

      <button type="submit" disabled={loading} class="btn-primary">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: var(--radius);
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  h1 {
    margin-bottom: 8px;
    font-size: 28px;
    color: var(--primary);
  }

  .subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 14px;
  }

  .error-message {
    background-color: #ffe6e6;
    color: var(--danger);
    padding: 12px;
    border-radius: var(--radius);
    margin-bottom: 20px;
    font-size: 14px;
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

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 14px;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
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
    transition: background-color 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2952a3;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
