FROM node:20

WORKDIR /app

# まず package.json と lock をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# その後にソースコードをコピー
COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]