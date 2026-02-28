# Zoopolis

Это репозиторий сайта Zoopolis. Этот проект включает в себя фронтенд на Next.js и бэкенд на Django.py с базой данных PostgreSQL.

## Описание

Сайт приложения Zoopolis является ассистентом для владельцев домашних питомцев, помогая с многими вопросами в этой сфере.

## Технологии

### Фронтенд

- **Next.js** - библиотека для создания пользовательских интерфейсов.

### Бэкенд

- **Django.py** - веб-фреймворк для Python.
- **PostgreSQL** - реляционная база данных для хранения данных.

### Дизайн

- **Figma** - [Дизайн проекта.](https://www.figma.com/design/WgjtG73yxsdg8KZqqVPeLU/Zoopolis-V2.0?node-id=171-1109&t=to7mXS1zUj8xkhNy-0)

## Установка

### Предварительные требования

Для запуска проекта вам потребуются:

- Node.js (рекомендуется версия 23.x или выше)
- PostgreSQL (рекомендуется версия 17.x или выше)

### Шаги для установки

1. **Клонирование репозитория:**

   ```sh
   git clone https://github.com/timofey1704/zoopolis-www
   cd zoopolis-www
   ```

2. **Установка зависимостей для фронтенда и бэкенда:**

   ```sh
   cd frontend
   npm install

   cd dashboard-frontend
   npm install

   cd backend
   pipenv shell
   pipenv install
   ```

3. **Настройка переменных окружения:**

   Создайте файл `.env` в директориях ./frontend, ./dashboard-frontend и ./backend и добавьте необходимые переменные окружения:

   ```
   env/backend
   #django settings
   SECRET_KEY=
   DEBUG_MODE=
   BASE_URL=
   MEDIA_ROOT=
   CORS_ALLOW_ALL_ORIGINS=
   CORS_ALLOWED_ORIGINS=
   ALLOWED_HOSTS=
   CSRF_TRUSTED_ORIGINS=


   #database
   DB_NAME=
   DB_USER=
   DB_PASSWORD=
   DB_HOST=
   DB_PORT=

   #telegram credentials
   BOT_TOKEN=
   CHAT_ID=

   ```

   ```
   env/frontend
   #server components url
   NEXT_PUBLIC_API_URL=
   ```

   ```
   env/dashboard-frontend
   #server components url
   NEXT_PUBLIC_API_URL=

   #auth
   NEXTAUTH_URL=
   BACKEND_URL=
   NEXTAUTH_SECRET=
   ```

4. **Настройка базы данных:**

   Создайте базу данных PostgreSQL и выполните миграции:

   ```sh
   createdb zoopolisdb
   # Выполните миграции, если они имеются. В проекте откройте директорию backend
   cd backend
   python manage.py migrate
   ```

5. **Локальная разработка:**

   Откройте три терминала или используйте вкладки в одном терминале.

   В первом терминале запустите бэкенд:

   ```
   cd backend
   python manage.py runserver
   ```

   Во втором терминале запустите фронтенд:

   ```
   cd frontend
   npm run dev
   ```

   Во третьем терминале запустите дашборд:

   ```
   cd dashboard-frontend
   npm run dev
   ```

Теперь проект будет доступен по адресу `http://localhost:3000`.

