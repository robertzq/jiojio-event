<template>
  <div class="card">
    <h2>✨ 给 Jiojio 的留言板 ✨</h2>
    <p class="subtitle">留下你的 ID，稍后将进行 3D 抽奖！</p>
    
    <div class="form-group">
      <input v-model="nickname" placeholder="你的 ID / 昵称 (必填)" class="input-field" />
    </div>
    
    <div class="form-group">
      <textarea v-model="content" placeholder="写点祝福的话吧..." rows="4" class="input-field"></textarea>
    </div>

    <button @click="submit" :disabled="loading || !nickname || !content" class="submit-btn">
      {{ loading ? '发送中...' : '提交留言 🚀' }}
    </button>

    <p v-if="success" class="success-msg">✅ 收到啦！坐等抽奖吧！</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const nickname = ref('');
const content = ref('');
const loading = ref(false);
const success = ref(false);

const submit = async () => {
  loading.value = true;
  try {
    // 这里的 /api 会被 Nginx 转发给后端
    await axios.post('/api/message', { 
      nickname: nickname.value, 
      content: content.value 
    });
    success.value = true;
    nickname.value = '';
    content.value = '';
    
    // 3秒后隐藏成功提示
    setTimeout(() => success.value = false, 3000);
  } catch (e) {
    alert('提交失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
h2 { color: #333; margin-bottom: 10px; }
.subtitle { color: #666; margin-bottom: 30px; font-size: 0.9em; }
.form-group { margin-bottom: 20px; }
.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box; /* 关键，防止溢出 */
}
.input-field:focus { border-color: #42b983; outline: none; }
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.submit-btn:hover:not(:disabled) { background: #3aa876; }
.success-msg { color: #42b983; margin-top: 20px; font-weight: bold; }
</style>