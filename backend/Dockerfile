FROM node:22-alpine3.22

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:push && npm run db:seed && npm run dev"]
