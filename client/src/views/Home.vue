<template>
  <div class="container">
    <h1>给 Jiojio 的留言板 📧</h1>
    <form @submit.prevent="submit">
      <input v-model="form.nickname" placeholder="你的ID/昵称 (用于抽奖)" required />
      <input v-model="form.contact" placeholder="联系方式 (中奖怎么找你)" required />
      <textarea v-model="form.content" placeholder="写下你的祝福..." required></textarea>
      <button :disabled="loading">{{ loading ? '发送中...' : '提交留言' }}</button>
    </form>
    <p v-if="success" class="success">发送成功！已通过邮件通知她啦。</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

const form = reactive({ nickname: '', contact: '', content: '' });
const loading = ref(false);
const success = ref(false);

const submit = async () => {
  loading.value = true;
  try {
    // 生产环境记得把 localhost 换成你的域名 api
    await axios.post('http://rbthusky.cn/api/message', form);
    success.value = true;
    form.content = ''; // 清空
  } catch (e) {
    alert('发送失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 简单写点样式，居中，好看点 */
.container { max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
input, textarea { width: 100%; margin-bottom: 10px; padding: 10px; display: block; }
button { width: 100%; padding: 10px; background: #42b983; color: white; border: none; cursor: pointer; }
</style>