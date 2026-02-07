FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

COPY shared/package.json ./shared/
COPY web/package.json ./web/
COPY server/package.json ./server/

RUN npm install

COPY shared ./shared
COPY web ./web
COPY server ./server

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/shared/ ./node_modules/@xhess/shared

RUN npm install

EXPOSE ${PORT:-8000}

CMD ["node", "dist/server.js"]

FROM node:20-alpine AS prod
WORKDIR /app

COPY --from=builder /app/web/.next/standalone/web ./
COPY --from=builder /app/web/.next/standalone/node_modules ./node_modules
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/.next/static ./.next/static

EXPOSE ${PORT:-3000}

CMD ["node", "server.js", "--", "--host", "0.0.0.0"]