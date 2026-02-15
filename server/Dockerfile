# 使用 Node 22 (与前端保持一致，避免版本问题)
FROM node:22-alpine

WORKDIR /app

# 先拷贝 package.json 安装依赖
COPY package*.json ./

# ⚠️ 关键：配置淘宝/国内镜像源，否则阿里云构建可能会卡死
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 拷贝剩余代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "index.js"]