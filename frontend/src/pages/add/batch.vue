<template>
  <div class="batch-page">
    <div class="card">
      <div class="form-group">
        <label class="form-label">批量添加提醒</label>
        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
          每行一条提醒，格式如下：
        </p>
        <div style="background: var(--bg); padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 12px;">
          <div style="margin-bottom: 4px;">生日:大舅-舅舅-农历3月15</div>
          <div style="margin-bottom: 4px;">会议:产品评审会-2026-04-25 14:00-会议室A</div>
          <div style="margin-bottom: 4px;">上课:高等数学-周一 08:00-教学楼301</div>
          <div>日程:交水电费-每月5号</div>
        </div>
        <textarea
          v-model="batchText"
          class="input"
          placeholder="粘贴或输入多条提醒..."
          rows="10"
        ></textarea>
      </div>

      <button class="btn btn-primary btn-block" @click="parse" :disabled="!batchText.trim()">
        预览
      </button>
    </div>

    <div v-if="previewResult" class="card">
      <div style="margin-bottom: 12px;">
        <strong>预览结果</strong>
        <span style="color: var(--success); margin-left: 12px;">✓ {{ previewResult.valid.length }} 条有效</span>
        <span v-if="previewResult.invalid.length" style="color: var(--error); margin-left: 8px;">
          ✕ {{ previewResult.invalid.length }} 条无效
        </span>
      </div>

      <div class="batch-preview">
        <div
          v-for="item in previewResult.valid"
          :key="item.lineNumber"
          class="preview-item"
        >
          <span class="preview-icon">✓</span>
          <span>{{ item.line }}</span>
        </div>
        <div
          v-for="item in previewResult.invalid"
          :key="item.lineNumber"
          class="preview-item error"
        >
          <span class="preview-icon">✕</span>
          <span>{{ item.line }}</span>
          <span style="margin-left: 8px; font-size: 11px;">{{ item.error }}</span>
        </div>
      </div>

      <button
        v-if="previewResult.valid.length > 0"
        class="btn btn-success btn-block"
        style="margin-top: 12px;"
        @click="importAll"
        :disabled="importing"
      >
        {{ importing ? '导入中...' : `导入 ${previewResult.valid.length} 条` }}
      </button>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <router-link to="/add" class="btn" style="color: var(--primary);">
        ← 返回单条添加
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { reminderApi } from '../../api/reminder'

const router = useRouter()
const batchText = ref('')
const previewResult = ref<any>(null)
const importing = ref(false)

async function parse() {
  if (!batchText.value.trim()) return

  // 本地解析预览
  const lines = batchText.value.split('\n').filter(l => l.trim())
  const valid: any[] = []
  const invalid: any[] = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) {
      invalid.push({ line, lineNumber: index + 1, error: '缺少冒号' })
      return
    }

    const type = trimmed.substring(0, colonIndex)
    const content = trimmed.substring(colonIndex + 1)
    const parts = content.split('-').map(p => p.trim())

    const validTypes = ['生日', '会议', '上课', '日程', '自定义']
    if (!validTypes.includes(type)) {
      invalid.push({ line, lineNumber: index + 1, error: `未知类型：${type}` })
      return
    }

    if (parts.length < 2) {
      invalid.push({ line, lineNumber: index + 1, error: '字段不足' })
      return
    }

    valid.push({ line, lineNumber: index + 1, type, parts })
  })

  previewResult.value = { valid, invalid, totalLines: lines.length }
}

async function importAll() {
  if (!previewResult.value || previewResult.value.valid.length === 0) return

  importing.value = true
  try {
    await reminderApi.batchCreateFromText(batchText.value)
    router.push('/')
  } catch (e) {
    alert('导入失败')
  } finally {
    importing.value = false
  }
}
</script>
