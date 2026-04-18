<template>
  <header class="top-nav reveal-up">
    <nav class="nav-menu" aria-label="主导航">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="pill-btn nav-pill">
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="profile-static">
      <img :src="profileAvatar" alt="dust 头像" class="profile-avatar" />
    </div>
  </header>
</template>

<script setup lang="ts">
import profileAvatar from '@/assets/profile/avatar.jpg'

type NavItem = {
  label: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Article', to: '/article' },
  { label: 'Resume', to: '/resume' }
]
</script>

<style scoped>
.top-nav {
  position: relative;
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dbe8f2;
  border-radius: 100px;
  box-shadow: 0 16px 36px rgba(100, 129, 164, 0.12);
  backdrop-filter: blur(8px);
}

.nav-menu {
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  gap: clamp(8px, 1.4vw, 14px);
  min-width: 0;
}

.profile-static {
  margin-left: auto;
  pointer-events: none;
}

.profile-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #d7e1ec;
  box-shadow: 0 8px 18px rgba(132, 150, 171, 0.2);
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
}

.pill-btn {
  border: 1px solid #d7e0ea;
  background: #ffffff;
  color: #12212f;
  height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(132, 150, 171, 0.2);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.nav-pill {
  white-space: nowrap;
}

.pill-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(132, 150, 171, 0.3);
}

.nav-pill.router-link-exact-active {
  border-color: #a8c5de;
  background: #e7f0f8;
  color: #0a3558;
  box-shadow: 0 12px 24px rgba(110, 141, 174, 0.28);
}

.reveal-up {
  opacity: 0;
  transform: translateY(18px);
  animation: revealUp 0.68s ease-out forwards;
}

@keyframes revealUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1280px) {
  .top-nav {
    border-radius: 28px;
  }

  .pill-btn {
    padding: 0 18px;
  }
}

@media (max-width: 720px) {
  .top-nav {
    padding: 12px;
    border-radius: 22px;
    gap: 10px;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .nav-menu {
    width: 100%;
    order: 1;
    gap: 8px;
  }

  .profile-static {
    order: 2;
    margin-left: auto;
  }

  .nav-pill {
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
    height: 42px;
    font-size: 13px;
    padding: 0 10px;
  }
}

:global(.dark) .top-nav {
  border-color: #263448;
  background: rgba(16, 27, 44, 0.84);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.36);
}

:global(.dark) .nav-pill {
  color: #d8e4f2;
}

:global(.dark) .nav-pill.router-link-exact-active {
  border-color: #3e5975;
  background: #15273c;
  color: #e6f0fb;
}

:global(.dark) .pill-btn {
  border-color: #2b3a50;
  background: #101d32;
  color: #d6e2f2;
}

:global(.dark) .profile-avatar {
  border-color: #2b3a50;
}
</style>
