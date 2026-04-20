<template>
  <div class="settings-page">
    <div class="card">
      <h3 style="margin-bottom: 16px;">关于提醒助手</h3>
      <div style="font-size: 14px; color: var(--text-secondary);">
        <p style="margin-bottom: 8px;">提醒助手可以帮助你管理各类提醒，包括：</p>
        <ul style="margin-left: 20px; margin-bottom: 12px;">
          <li>🎂 生日提醒（支持农历）</li>
          <li>📅 会议提醒</li>
          <li>📚 上课提醒</li>
          <li>📝 日程提醒</li>
          <li>🔔 自定义提醒</li>
        </ul>
        <p>每天早上 8:00，系统会自动检查当天的提醒，并通过企业微信发送给你。</p>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 16px;">批量添加格式说明</h3>
      <div style="font-size: 13px; background: var(--bg); padding: 12px; border-radius: 6px;">
        <div style="margin-bottom: 8px;"><strong>生日模式：</strong>生日:标题-关系-日期</div>
        <div style="margin-bottom: 8px; font-size: 12px; color: var(--text-secondary);">
          示例：生日:大舅-舅舅-农历3月15
        </div>

        <div style="margin-bottom: 8px; margin-top: 12px;"><strong>会议模式：</strong>会议:标题-时间-地点</div>
        <div style="margin-bottom: 8px; font-size: 12px; color: var(--text-secondary);">
          示例：会议:产品评审会-2026-04-25 14:00-会议室A
        </div>

        <div style="margin-bottom: 8px; margin-top: 12px;"><strong>上课模式：</strong>上课:标题-时间-教室</div>
        <div style="margin-bottom: 8px; font-size: 12px; color: var(--text-secondary);">
          示例：上课:高等数学-周一 08:00-教学楼301
        </div>

        <div style="margin-bottom: 8px; margin-top: 12px;"><strong>日程模式：</strong>日程:标题-时间</div>
        <div style="margin-bottom: 8px; font-size: 12px; color: var(--text-secondary);">
          示例：日程:交水电费-每月5号
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 16px;">联系方式</h3>
      <p style="font-size: 14px; color: var(--text-secondary);">
        如有问题或建议，请联系管理员。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
