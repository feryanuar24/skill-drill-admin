<script lang="ts">
  import { isLoggedIn } from "../stores/auth";
  import { navigate } from "../stores/router";
</script>

<div class="landing-container">
  <div class="landing-card">
    <div class="logo-container">
      <span class="logo-icon">🎯</span>
      <h1>Skill Drill Admin</h1>
    </div>

    <p class="description">
      Welcome to the Skill Drill administration portal. Manage users, curate
      learning topics, and generate questions using AI.
    </p>

    <div class="actions">
      {#if $isLoggedIn}
        <button class="btn btn-primary" on:click={() => navigate("/dashboard")}>
          Go to Dashboard 📊
        </button>
      {:else}
        <button class="btn btn-primary" on:click={() => navigate("/login")}>
          Login to Admin Panel 🔑
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .landing-container {
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
    font-family: inherit;
  }

  .landing-card {
    background: white;
    border-radius: var(--radius);
    padding: 40px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }

  .logo-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  h1 {
    font-size: 32px;
    color: var(--primary);
    margin: 0;
  }

  .description {
    color: #555;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .actions {
    display: flex;
    justify-content: center;
  }

  .btn {
    padding: 12px 32px;
    border: none;
    border-radius: var(--radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background-color: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(51, 102, 204, 0.3);
  }

  .btn-primary:hover {
    background-color: #2952a3;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(51, 102, 204, 0.4);
  }
</style>
