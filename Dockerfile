FROM node:18.18

WORKDIR /usr/TaskHub

COPY package.json ./

RUN npm install

COPY . ./
COPY .env .env
RUN npx prisma generate

CMD ["npm", "run", "dev"]

