require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// 1. 连接数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/jiojio_event')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// 2. 定义留言模型
const MessageSchema = new mongoose.Schema({
  nickname: { type: String, required: true }, // 核心字段：ID/昵称
  content: { type: String, required: true },  // 核心字段：留言内容
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 3. 邮件服务配置 (如果没配好，会打印错误但不会崩)
const transporter = nodemailer.createTransport({
  service: 'qq', 
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- 接口区域 ---

// [POST] 提交留言
app.post('/api/message', async (req, res) => {
  try {
    const { nickname, content } = req.body;
    if (!nickname || !content) return res.status(400).json({ error: '请填写完整' });

    // 存入数据库
    const msg = await Message.create({ nickname, content });
    console.log(`收到新留言: ${nickname}`);

    // 发邮件 (异步执行，不阻塞用户)
    if (process.env.EMAIL_USER) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.TARGET_EMAIL,
          subject: `【新留言】来自 ${nickname}`,
          text: `ID: ${nickname}\n内容: ${content}\n时间: ${new Date().toLocaleString()}`
        };
        transporter.sendMail(mailOptions).catch(e => console.error('邮件发送失败:', e.message));
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '服务器开小差了' });
  }
});

// [GET] 导出 JSON (给 Godot 抽奖用)
// 访问方式: /api/export?secret=你的密钥
app.get('/api/export', async (req, res) => {
  const secret = req.query.secret;
  // 简单校验一下，防止别人瞎下载
  if (secret !== process.env.DRAW_SECRET) {
    return res.status(403).json({ error: '暗号错误' });
  }

  try {
    // 只取 nickname 和 content，不需要其他字段
    const data = await Message.find({}, 'nickname content -_id');
    
    // 设置为下载文件
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=lottery_data.json');
    
    // 发送格式化后的 JSON
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ error: '导出失败' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));