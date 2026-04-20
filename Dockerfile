FROM node:18-alpine                                                                                                                                                                                                                                                                                                                                                                                                                                                                 WORKDIR /app                                                                                                                                                                                                                               
  COPY backend/package*.json ./backend/
  WORKDIR /app/backend
  RUN npm install

  COPY backend/prisma ./prisma
  RUN npx prisma generate

  COPY backend/src ./src
  RUN npm run build                                                                                                                                                                                                                          
  CMD ["node", "dist/main.js"]
