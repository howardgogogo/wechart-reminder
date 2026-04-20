<template>
  <div id="app">
    <div class="header">
      <h1>提醒助手</h1>
    </div>
    <nav class="nav">
      <router-link to="/" class="nav-btn" :class="{ active: $route.path === '/' }">
        提醒列表
      </router-link>
      <router-link to="/add" class="nav-btn" :class="{ active: $route.path === '/add' }">
        添加提醒
      </router-link>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
