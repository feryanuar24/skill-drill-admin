<script lang="ts">
  export let title = "";
</script>

<div class="layout">
  <div class="content">
    {#if title}
      <h1 class="page-title">{title}</h1>
    {/if}
    <slot />
  </div>
</div>

<style>
  .layout {
    margin-left: 250px;
    padding: 20px;
    min-height: 100vh;
    background-color: var(--bg);
  }

  .page-title {
    font-size: 28px;
    margin-bottom: 24px;
    color: var(--primary);
  }

  @media (max-width: 768px) {
    .layout {
      margin-left: 0;
      margin-top: 60px;
      padding: 15px;
    }

    .page-title {
      font-size: 24px;
      margin-bottom: 20px;
    }
  }
</style>
