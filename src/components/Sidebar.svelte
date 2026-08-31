<script lang="ts">
  import { currentUser, logout } from "../stores/auth";
  import { navigate } from "../stores/router";
  import { currentPage } from "../stores/router";

  let showMobileMenu = false;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleNavigation(page: string, event: Event) {
    event.preventDefault();
    navigate(`/${page}`);
    showMobileMenu = false;
  }
</script>

<nav class="sidebar">
  <div class="logo">
    <h1>Admin Panel</h1>
  </div>

  <ul class="menu">
    <li>
      <a
        href="/"
        on:click={(e) => handleNavigation("dashboard", e)}
        class:active={$currentPage === "dashboard"}
      >
        📊 Dashboard
      </a>
    </li>
    <li>
      <a
        href="/users"
        on:click={(e) => handleNavigation("users", e)}
        class:active={$currentPage === "users"}
      >
        👥 Users
      </a>
    </li>
    <li>
      <a
        href="/topics"
        on:click={(e) => handleNavigation("topics", e)}
        class:active={$currentPage === "topics"}
      >
        📚 Topics
      </a>
    </li>
    <li>
      <a
        href="/generate-questions"
        on:click={(e) => handleNavigation("generate-questions", e)}
        class:active={$currentPage === "generate-questions"}
      >
        ❓ Generate Questions
      </a>
    </li>
  </ul>

  <div class="user-section">
    <p class="user-name">{$currentUser?.username || "Admin"}</p>
    <button class="btn-logout" on:click={handleLogout}>Logout</button>
  </div>
</nav>

<style>
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background-color: var(--primary);
    color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .logo {
    padding: 20px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  }

  .logo h1 {
    font-size: 20px;
    margin: 0;
  }

  .menu {
    list-style: none;
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }

  .menu li {
    margin: 0;
  }

  .menu a {
    display: block;
    padding: 15px 20px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s;
    border-left: 4px solid transparent;
  }

  .menu a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .menu a.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-left-color: white;
  }

  .user-section {
    padding: 20px;
    border-top: 2px solid rgba(255, 255, 255, 0.1);
  }

  .user-name {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  .btn-logout {
    width: 100%;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .btn-logout:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
    }

    .logo {
      padding: 0;
      border: none;
      margin-right: auto;
    }

    .logo h1 {
      font-size: 16px;
    }

    .menu {
      display: none;
      padding: 0;
    }

    .user-section {
      padding: 0;
      border: none;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .user-name {
      margin: 0;
      display: none;
    }

    .btn-logout {
      width: auto;
      padding: 8px 16px;
    }
  }
</style>
