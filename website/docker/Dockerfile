# The Burro - Next.js Production Dockerfile
# VM-side production image with project-root layout preserved

FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /workspace/website/frontend

COPY website/frontend/package.json website/frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --config.node-linker=hoisted

COPY website/frontend/ ./
WORKDIR /workspace
COPY assistant ./assistant
COPY data ./data
COPY website/cms ./website/cms

WORKDIR /workspace/website/frontend
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm exec next build

FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /workspace/website/frontend

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /workspace/website/frontend/package.json ./package.json
COPY --from=build /workspace/website/frontend/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /workspace/website/frontend/node_modules ./node_modules
COPY --from=build /workspace/website/frontend/.next ./.next
COPY --from=build /workspace/website/frontend/public ./public
COPY --from=build /workspace/website/frontend/next.config.mjs ./next.config.mjs
COPY --from=build /workspace/assistant /workspace/assistant
COPY --from=build /workspace/data /workspace/data
COPY --from=build /workspace/website/cms /workspace/website/cms

EXPOSE 3000

CMD ["pnpm", "exec", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
