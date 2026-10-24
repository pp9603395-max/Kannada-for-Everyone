# syntax=docker/dockerfile:1

# ---------- Build the Vite client + typecheck ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Production runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

# The Express server runs TypeScript through `tsx`, so ship the server source,
# shared data modules, and the prebuilt client bundle.
COPY --from=build /app/dist ./dist
COPY server.ts ./
COPY server ./server
COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./
COPY firebase-applet-config.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
