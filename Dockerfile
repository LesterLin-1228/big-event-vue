# 使用官方的 Node 映像作為基礎
FROM node:20 as build-stage
# 設定容器的工作目錄為 /app
WORKDIR /app
# 複製 package.json 和 package-lock.json 到容器中
COPY package*.json ./
# 安裝依賴
RUN npm install
# 複製所有源代碼到容器中
COPY . .
# 執行打包
RUN npm run build

# 使用官方的 Nginx 映像作為基礎
FROM nginx:latest
# 將第一個階段打包好的前端檔案複製到 Nginx 的預設靜態資源目錄
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 複製自定義的 Nginx 配置文件到容器中的配置目錄
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
