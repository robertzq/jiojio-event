# 这里一定要改成 22-alpine 或者 20-alpine，解决 Vite 6 的报错
FROM node:22-alpine as build-stage

WORKDIR /app
COPY package*.json ./
# 加速 npm 安装（可选，如果卡住可以用这个）
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY . .
RUN npm run build

# 生产环境 Nginx
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]