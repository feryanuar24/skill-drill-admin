<script lang="ts">
  import { isLoggedIn } from "../stores/auth";
  import { link } from "../stores/routerCompat";
</script>

<div
  class="min-h-screen bg-[#fdf5cb] flex flex-col justify-between p-4 sm:p-8 md:p-12 font-sans relative overflow-hidden selection:bg-black selection:text-[#fde047]"
>
  <!-- Background Geometric Accent Dots -->
  <div
    class="absolute inset-0 pointer-events-none opacity-20"
    style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 24px 24px;"
  ></div>

  <!-- Ambient Floating Background Shapes -->
  <div
    class="absolute -top-12 -left-12 w-48 h-48 rounded-full border-4 border-black bg-[#f43f5e] z-0 opacity-40 blur-xs"
  ></div>
  <div
    class="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-4 border-black bg-[#38bdf8] z-0 opacity-30 blur-xs"
  ></div>

  <!-- Top Navbar / Header -->
  <header
    class="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between py-2 mb-6 sm:mb-10"
  >
    <div class="flex items-center space-x-3">
      <div
        class="w-10 h-10 sm:w-12 sm:h-12 bg-[#fde047] border-3 sm:border-4 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      </div>
      <div>
        <span
          class="font-black text-lg sm:text-xl tracking-tight text-black uppercase"
          >Skill Drill</span
        >
        <span
          class="hidden sm:inline-block ml-2 text-xs font-black uppercase bg-black text-white px-2 py-0.5 rounded border border-black"
          >Admin</span
        >
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <div
        class="inline-flex items-center space-x-2 bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-bold text-black"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
        ></span>
        <span>Portal V1.0</span>
      </div>
    </div>
  </header>

  <!-- Main 2-Column Hero Section -->
  <main
    class="relative z-10 max-w-7xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
  >
    <!-- Kolom 1: Konten Teks & CTA (Judul, Deskripsi, Button) -->
    <div class="lg:col-span-6 xl:col-span-7 flex flex-col items-start">
      <!-- Badge Category -->
      <div
        class="inline-flex items-center gap-2 bg-[#fde047] border-3 border-black px-3.5 py-1.5 rounded-md shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-5 transform -rotate-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            fill-rule="evenodd"
            d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.502.8.95 0.95l1.182.393a.75.75 0 0 1 0 1.422l-1.182.393c-.448.15-.8.503-.95.95l-.394 1.183a.75.75 0 0 1-1.424 0l-.393-1.183a1.5 1.5 0 0 0-.95-.95l-1.183-.393a.75.75 0 0 1 0-1.422l1.183-.393c.447-.15.8-.503.95-.95l.393-1.183A.75.75 0 0 1 16.5 15Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-xs font-black uppercase tracking-wider text-black"
          >AI-Powered Learning Platform</span
        >
      </div>

      <!-- Main Headline -->
      <h1
        class="text-4xl sm:text-5xl xl:text-6xl font-black text-black uppercase tracking-tight leading-[1.08] mb-6"
      >
        Kelola & Tingkatkan <br />
        <span
          class="inline-block bg-[#a78bfa] text-white px-3 py-0.5 border-4 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1 mt-1"
        >
          Skill Pembelajaran
        </span>
        <br class="hidden sm:inline" />
        Dengan Cerdas
      </h1>

      <!-- Deskripsi -->
      <p
        class="text-base sm:text-lg font-medium text-black/90 leading-relaxed mb-8 max-w-xl bg-white border-3 border-black p-5 rounded-xl shadow-[5px_5px_0px_rgba(0,0,0,1)]"
      >
        Pusat kendali admin Skill Drill untuk mengelola data pengguna, mengatur
        topik dan modul kuis, serta men-generate soal latihan otomatis bertenaga
        kecerdasan buatan (AI).
      </p>

      <!-- Fitur Poin Singkat -->
      <div class="flex flex-wrap gap-2.5 mb-8">
        <div
          class="flex items-center gap-1.5 bg-[#86efac] border-2 border-black px-3 py-1 rounded-md text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          <span>⚡</span>
          <span>AI Generator</span>
        </div>
        <div
          class="flex items-center gap-1.5 bg-[#67e8f9] border-2 border-black px-3 py-1 rounded-md text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          <span>🎯</span>
          <span>Manajemen Topik</span>
        </div>
        <div
          class="flex items-center gap-1.5 bg-[#fb923c] border-2 border-black px-3 py-1 rounded-md text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white"
        >
          <span>🛡️</span>
          <span>Akses Terproteksi</span>
        </div>
      </div>

      <!-- Action Button (Login / Dashboard) -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
      >
        {#if $isLoggedIn}
          <a
            href="/dashboard"
            use:link
            class="group inline-flex items-center justify-center px-8 py-4 bg-[#fde047] hover:bg-[#facc15] border-4 border-black text-black font-black text-base uppercase tracking-wider rounded-xl shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_rgba(0,0,0,1)] active:translate-x-1.5 active:translate-y-1.5 transition-all cursor-pointer"
          >
            <span>Buka Dashboard</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        {:else}
          <a
            href="/login"
            use:link
            class="group inline-flex items-center justify-center px-8 py-4 bg-[#fde047] hover:bg-[#facc15] border-4 border-black text-black font-black text-base uppercase tracking-wider rounded-xl shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_rgba(0,0,0,1)] active:translate-x-1.5 active:translate-y-1.5 transition-all cursor-pointer"
          >
            <span>Masuk ke Admin Portal</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </a>
        {/if}
      </div>
    </div>

    <!-- Kolom 2: Elemen Hiasan Geometri (Geometric Neo-Brutalist Composition) -->
    <div
      class="lg:col-span-6 xl:col-span-5 flex items-center justify-center relative mt-6 lg:mt-0"
    >
      <!-- Container Kartu Geometri Utama -->
      <div class="relative w-full max-w-md">
        <!-- Floating Decorative Background Shapes -->
        <div
          class="absolute -top-6 -right-6 w-20 h-20 bg-[#fb923c] border-4 border-black rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white font-black text-2xl rotate-12 z-20"
        >
          ✦
        </div>

        <div
          class="absolute -bottom-6 -left-6 bg-[#38bdf8] border-4 border-black px-4 py-2 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-sm uppercase tracking-wider text-black -rotate-6 z-20 flex items-center gap-2"
        >
          <span class="w-3 h-3 bg-black rounded-full"></span>
          <span>Quiz & Drills</span>
        </div>

        <!-- Main Geometric Canvas Card -->
        <div
          class="bg-white border-4 border-black rounded-2xl shadow-[10px_10px_0px_rgba(0,0,0,1)] p-6 sm:p-8 relative overflow-hidden z-10"
        >
          <!-- Grid Canvas Inside -->
          <div
            class="w-full aspect-4/3 rounded-xl border-4 border-black bg-[#fef9c3] p-6 relative flex flex-col items-center justify-center overflow-hidden"
          >
            <!-- Decorative Geo Patterns Inside Canvas -->
            <div
              class="absolute inset-0 opacity-15"
              style="background-image: repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 16px);"
            ></div>

            <!-- Concentric Circle Graphic -->
            <div
              class="absolute w-44 h-44 rounded-full border-4 border-dashed border-black/40 animate-[spin_30s_linear_infinite]"
            ></div>

            <!-- Geometric Composition Layers -->
            <div class="relative z-10 flex flex-col items-center">
              <!-- Geometric Layer 1: Rhombus / Square rotated -->
              <div class="relative mb-3">
                <div
                  class="w-24 h-24 bg-[#f43f5e] border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-45 flex items-center justify-center transition-transform hover:rotate-90 duration-300"
                >
                  <div
                    class="w-12 h-12 bg-[#fde047] border-3 border-black rounded-lg transform -rotate-45 flex items-center justify-center text-black font-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2.5"
                      stroke="currentColor"
                      class="w-7 h-7"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Floating Geometric Mini Circles -->
                <div
                  class="absolute -top-3 -right-3 w-7 h-7 bg-[#a855f7] border-3 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                ></div>
                <div
                  class="absolute -bottom-2 -left-3 w-6 h-6 bg-[#38bdf8] border-3 border-black rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] rotate-12"
                ></div>
              </div>

              <!-- Label in Geo Card -->
              <span
                class="bg-black text-white px-3 py-1 rounded border-2 border-black font-black text-xs uppercase tracking-widest mt-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                Engineered for Learning
              </span>
            </div>
          </div>

          <!-- Bottom Geometric Badges inside Card -->
          <div class="mt-4 pt-4 border-t-3 border-black grid grid-cols-3 gap-2">
            <!-- Box 1 -->
            <div
              class="bg-[#fed7aa] border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center"
            >
              <div
                class="w-5 h-5 bg-[#ea580c] border-2 border-black rounded-full mb-1 flex items-center justify-center text-[10px] text-white font-bold"
              >
                ▲
              </div>
              <span class="font-black text-xs text-black uppercase">Topics</span
              >
            </div>

            <!-- Box 2 -->
            <div
              class="bg-[#e9d5ff] border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center"
            >
              <div
                class="w-5 h-5 bg-[#9333ea] border-2 border-black rounded-md rotate-45 mb-1 flex items-center justify-center text-[10px] text-white font-bold"
              >
                <span class="-rotate-45">■</span>
              </div>
              <span class="font-black text-xs text-black uppercase">Users</span>
            </div>

            <!-- Box 3 -->
            <div
              class="bg-[#bbf7d0] border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center"
            >
              <div
                class="w-5 h-5 bg-[#16a34a] border-2 border-black rounded-sm mb-1 flex items-center justify-center text-[10px] text-white font-bold"
              >
                ●
              </div>
              <span class="font-black text-xs text-black uppercase">AI Q&A</span
              >
            </div>
          </div>
        </div>

        <!-- Decorative Pattern Dots Block behind main card -->
        <div
          class="absolute -z-10 -bottom-4 -right-4 w-full h-full border-4 border-black bg-black rounded-2xl"
        ></div>
      </div>
    </div>
  </main>

  <!-- Footer Info -->
  <footer
    class="relative z-10 max-w-7xl w-full mx-auto mt-6 sm:mt-10 pt-4 border-t-2 border-black/20 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-black/70 gap-2"
  >
    <p>
      © {new Date().getFullYear()} Skill Drill Platform. All rights reserved.
    </p>
    <div class="flex items-center space-x-4">
      <span class="hover:text-black cursor-pointer">Admin Access Only</span>
      <span>•</span>
      <span class="hover:text-black cursor-pointer">AI Integrated</span>
    </div>
  </footer>
</div>
