FROM node:25-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app


FROM base AS prune
RUN yarn global add turbo
COPY . .
RUN turbo prune bff --docker

FROM base AS builder
COPY --from=prune /app/out/json/ .
RUN yarn install
COPY --from=prune /app/out/full/ .

RUN yarn build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
USER express

EXPOSE 3001

WORKDIR /app
COPY --from=builder /app/apps/bff/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]