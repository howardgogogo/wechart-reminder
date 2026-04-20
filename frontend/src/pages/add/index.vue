<template>
  <div class="add-page">
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

    <div class="card">
      <div class="form-group">
        <label class="form-label">标题</label>
        <input v-model="form.title" class="input" :placeholder="titlePlaceholder" />
      </div>

      <div class="form-group" v-if="form.mode === 'BIRTHDAY'">
        <label class="form-label">关系（如：舅舅、朋友）</label>
        <input v-model="form.content" class="input" placeholder="填写关系" />
      </div>

      <div class="form-group">
        <label class="form-label">时间</label>
        <input v-model="form.remindTime" class="input" type="datetime-local" />
      </div>

      <div class="form-group" v-if="form.mode === 'MEETING' || form.mode === 'CLASS'">
        <label class="form-label">地点</label>
        <input v-model="form.location" class="input" placeholder="填写地点" />
      </div>

      <div class="form-group">
        <label class="form-label">内容（可选）</label>
        <textarea v-model="form.content" class="input" v-if="form.mode !== 'BIRTHDAY'" placeholder="填写内容"></textarea>
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
          <option value="YEARLY" v-if="form.mode === 'BIRTHDAY'">每年</option>
        </select>
      </div>

      <button class="btn btn-primary btn-block" @click="submit" :disabled="submitting">
        {{ submitting ? '保存中...' : '保存' }}
      </button>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <router-link to="/add/batch" class="btn" style="color: var(--primary);">
        批量添加 →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { reminderApi, modeConfig } from '../../api/reminder'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  mode: 'BIRTHDAY' as const,
  title: '',
  content: '',
  location: '',
  remindTime: '',
  isLunar: false,
  repeatType: 'ONCE' as const,
})

const titlePlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    BIRTHDAY: '如：大舅的生日',
    MEETING: '如：产品评审会',
    CLASS: '如：高等数学',
    SCHEDULE: '如：交水电费',
    CUSTOM: '如：重要事项',
  }
  return placeholders[form.mode] || '填写标题'
})

async function submit() {
  if (!form.title || !form.remindTime) {
    alert('请填写标题和时间')
    return
  }

  submitting.value = true
  try {
    await reminderApi.create({
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
    submitting.value = false
  }
}
</script>
