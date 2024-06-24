FROM node:20

WORKDIR /usr/TaskHub

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

CMD npx prisma db push && npm run dev




