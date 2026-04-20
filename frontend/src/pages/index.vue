<template>
  <div class="home-page">
    <div v-if="loading" class="empty-state">
      <p>加载中...</p>
    </div>
    <div v-else-if="reminders.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">暂无提醒</p>
      <router-link to="/add" class="btn btn-primary">添加第一个提醒</router-link>
    </div>
    <div v-else>
      <div class="card reminder-card" :class="r.mode.toLowerCase()" v-for="r in reminders" :key="r.id">
        <div class="reminder-header">
          <span class="reminder-title">{{ r.title }}</span>
          <span class="reminder-badge" :style="{ background: modeConfig[r.mode].color }">
            {{ modeConfig[r.mode].label }}
          </span>
        </div>
        <div class="reminder-meta">
          <span>{{ formatTime(r.remindTime) }}</span>
          <span v-if="r.location"> · {{ r.location }}</span>
        </div>
        <div class="reminder-meta" v-if="r.content">
          {{ r.content }}
        </div>
        <div class="reminder-actions">
          <button class="action-btn edit" @click="goEdit(r.id)">编辑</button>
          <button class="action-btn delete" @click="deleteReminder(r.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reminderApi, modeConfig, type Reminder } from '../api/reminder'

const router = useRouter()
const reminders = ref<Reminder[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    reminders.value = await reminderApi.list()
  } catch (e) {
    console.error('Failed to load reminders:', e)
  } finally {
    loading.value = false
  }
})

function formatTime(time: string): string {
  const d = new Date(time)
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function goEdit(id: string) {
  router.push(`/edit/${id}`)
}

async function deleteReminder(id: string) {
  if (!confirm('确定要删除这条提醒吗？')) return
  try {
    await reminderApi.delete(id)
    reminders.value = reminders.value.filter(r => r.id !== id)
  } catch (e) {
    alert('删除失败')
  }
}
</script>
