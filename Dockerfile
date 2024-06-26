FROM node:20

WORKDIR /usr/TaskHub

COPY package*.json ./
RUN npm install

COPY . .


CMD npx prisma generate && npx prisma db push && npm run dev




