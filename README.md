## Projet: Takshub

### Description

Ce projet est une application web développée avec Next.js, un framework React pour les applications web modernes.
L'application est conçue pour fonctionner dans un conteneur Docker, ce qui facilite son déploiement et sa gestion.
Takshub est un gestionnaire de tâches simple qui permet de créer, modifier et supprimer des tâches avec une gestion des
organisations.

### Prérequis

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/) (facultatif pour le développement local)

### Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/PomUBanban/TaskHub
   cd TaskHub
   ```

2. **Construire et démarrer les conteneurs Docker :**

   ```bash
   docker compose up --build
   ```

   Cette commande va créer les images Docker nécessaires et démarrer les conteneurs pour l'application.

3. **Accéder à l'application :**

   Une fois les conteneurs démarrés, l'application sera accessible à l'adresse
   suivante : [http://localhost:3000](http://localhost:3000)

### Dockerfile

Le `Dockerfile` décrit comment construire l'image Docker pour l'application.

```Dockerfile
FROM node:20

WORKDIR /usr/TaskHub

COPY package*.json ./
RUN npm install

COPY . .


CMD npx prisma generate && npx prisma db push && npm run dev
```

### docker-compose.yml

Le fichier `docker-compose.yml` définit les services nécessaires pour exécuter l'application.

```yaml
services:
  taskhub:
    image: albanagisa/taskhub
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"
    restart: on-failure
    volumes:
      - /usr/TaskHub/node_modules
    command: >
      sh -c "npx prisma generate && npx prisma db push && npm run build && npm run start"

  db:
    image: mysql:latest
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 1s
      timeout: 5s
      retries: 300
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: database
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  db_data:
```

### Scripts NPM

- **Développement :**
  Remplacer les ligne suivant du docker-compose

```yaml
image: albanagisa/taskhub
depends_on:
  db:
    condition: service_healthy
restart: on-failure
ports:
  - "3000:3000"
volumes:
  - /usr/TaskHub/node_modules
command: >
  sh -c "npx prisma generate && npx prisma db push && npm run build && npm run start"
```

par

```yaml
build:
  context: .
  dockerfile: Dockerfile
depends_on:
  db:
    condition: service_healthy
restart: on-failure
ports:
  - "3000:3000"
volumes:
  - ./:/usr/TaskHub
  - /usr/TaskHub/node_modules
command: >
  sh -c "npx prisma generate && npx prisma db push && npm run dev"
```

### Contribuer

1. Forker le projet
2. Créer une nouvelle branche (`git checkout -b feature/ma-feature`)
3. Commiter vos changements (`git commit -am 'Ajouter une nouvelle fonctionnalité'`)
4. Pusher la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

---

Pour toute question ou assistance, veuillez contacter l'équipe de développement.
