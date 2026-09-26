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
COPY packages/ui packages/ui
COPY apps/web apps/web
# Public same-origin browser configuration only. No runtime secrets are compiled into JS.
ENV VITE_API_BASE_URL=/api/v1
RUN pnpm --filter @waypoint/shared build && pnpm --filter @waypoint/web build

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
ENV API_UPSTREAM=http://api:3000
ENV NGINX_ENVSUBST_FILTER=API_UPSTREAM
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
