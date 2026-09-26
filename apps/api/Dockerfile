FROM node:22-bookworm-slim AS build
WORKDIR /workspace
RUN npm install --global pnpm@10.28.2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @waypoint/shared build && pnpm --filter @waypoint/api db:generate && pnpm --filter @waypoint/api build
RUN pnpm --filter @waypoint/api deploy --legacy --prod /output/api

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN npm install --global pnpm@10.28.2
COPY --from=build --chown=node:node /output/api ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate && exec node dist/src/main.js"]
