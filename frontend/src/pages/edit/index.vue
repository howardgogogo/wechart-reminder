<template>
  <div class="edit-page">
    <div v-if="loading" class="empty-state">
      <p>加载中...</p>
    </div>
    <div v-else-if="!reminder" class="empty-state">
      <p>提醒不存在</p>
    </div>
    <div v-else class="card">
      <div class="mode-selector">
        <div
          v-for="(cfg, mode) in modeConfig"
          :key="mode"
          class="mode-btn"
          :class="{ active: form.mode === mode }"
          @click="form.mode = mode"
        >
          <div class="mode-icon">{{ cfg.icon }}</div>
          <div class="mode-text">{{ cfg.label }}</div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">标题</label>
        <input v-model="form.title" class="input" />
      </div>

      <div class="form-group" v-if="form.mode === 'BIRTHDAY'">
        <label class="form-label">关系</label>
        <input v-model="form.content" class="input" />
      </div>

      <div class="form-group">
        <label class="form-label">时间</label>
        <input v-model="form.remindTime" class="input" type="datetime-local" />
      </div>

      <div class="form-group" v-if="form.mode === 'MEETING' || form.mode === 'CLASS'">
        <label class="form-label">地点</label>
        <input v-model="form.location" class="input" />
      </div>

      <div class="form-group" v-if="form.mode !== 'BIRTHDAY'">
        <label class="form-label">内容</label>
        <textarea v-model="form.content" class="input"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">
          <input type="checkbox" v-model="form.isLunar" /> 农历日期
        </label>
      </div>

      <div class="form-group">
        <label class="form-label">重复</label>
        <select v-model="form.repeatType" class="input">
          <option value="ONCE">仅一次</option>
          <option value="YEARLY">每年</option>
        </select>
      </div>

      <button class="btn btn-primary btn-block" @click="save" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reminderApi, modeConfig, type Reminder } from '../../api/reminder'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const saving = ref(false)
const reminder = ref<Reminder | null>(null)

const form = reactive({
  mode: 'BIRTHDAY' as Reminder['mode'],
  title: '',
  content: '',
  location: '',
  remindTime: '',
  isLunar: false,
  repeatType: 'ONCE' as Reminder['repeatType'],
})

onMounted(async () => {
  try {
    reminder.value = await reminderApi.get(route.params.id as string)
    form.mode = reminder.value.mode
    form.title = reminder.value.title
    form.content = reminder.value.content || ''
    form.location = reminder.value.location || ''
    form.isLunar = reminder.value.isLunar
    form.repeatType = reminder.value.repeatType

    const d = new Date(reminder.value.remindTime)
    form.remindTime = d.toISOString().slice(0, 16)
  } catch (e) {
    console.error('Failed to load reminder:', e)
  } finally {
    loading.value = false
  }
})

async function save() {
  if (!form.title || !form.remindTime) {
    alert('请填写标题和时间')
    return
  }

  saving.value = true
  try {
    await reminderApi.update(route.params.id as string, {
      mode: form.mode,
      title: form.title,
      content: form.content || undefined,
      location: form.location || undefined,
      remindTime: new Date(form.remindTime).toISOString(),
      isLunar: form.isLunar,
      repeatType: form.repeatType,
    })
    router.push('/')
  } catch (e) {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}
</script>
