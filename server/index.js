require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// 1. 连接 MongoDB (建议加上鉴权)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jiojio_event');

// 2. 定义 Schema
const MessageSchema = new mongoose.Schema({
  nickname: { type: String, required: true }, // 留言ID/昵称
  content: { type: String, required: true },  // 留言内容
  contact: String,                            //以此联系中奖
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 3. 配置邮件发送服务 (以QQ邮箱或网易为例，阿里云由于封25端口，必须用SSL 465)
const transporter = nodemailer.createTransport({
  service: 'qq', // 或者 'smtp.ym.163.com' 等企业邮
  secure: true,  // 必须为 true
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // 发件人邮箱
    pass: process.env.EMAIL_PASS  // SMTP 授权码
  }
});

// --- API 路由 ---

// 提交留言接口
app.post('/api/message', async (req, res) => {
  try {
    const { nickname, content, contact } = req.body;
    
    // 保存到数据库
    const msg = await Message.create({ nickname, content, contact });

    // 异步发送邮件给她 (不阻塞响应)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TARGET_EMAIL, // "她"的邮箱
      subject: `【新留言】来自 ${nickname} 的祝福`,
      text: `ID/昵称: ${nickname}\n内容: ${content}\n联系方式: ${contact}\n时间: ${new Date().toLocaleString()}`
    };
    
    transporter.sendMail(mailOptions).catch(err => console.error('邮件发送失败:', err));

    res.json({ success: true, id: msg._id });
  } catch (error) {
    res.status(500).json({ error: '提交失败' });
  }
});

// 隐藏抽奖接口 (随机抽取10人)
// 也可以加一个简单的 secret key 校验防止被路人刷接口
app.get('/api/draw-lucky-dogs', async (req, res) => {
  try {
    const secret = req.query.key;
    if (secret !== process.env.DRAW_SECRET) return res.status(403).send('滚犊子');

    // MongoDB 原生随机抽样
    const winners = await Message.aggregate([
      { $sample: { size: 10 } }
    ]);
    
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: '抽奖失败' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));