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

- Node.js (рекомендуется версия 20.x или выше)
- PostgreSQL (рекомендуется версия 12.x или выше)

### Шаги для установки

1. **Клонирование репозитория:**

   ```sh
   git clone https://gitlab.com/wedeving/zoopolis-www
   cd zoopolis-www
   ```

2. **Установка зависимостей для фронтенда и бэкенда:**

   ```sh
   cd frontend
   npm install

   cd backend
   pipenv shell
   pipenv install
   ```

3. **Настройка переменных окружения:**

   Создайте файл `.env` в директориях ./frontend и ./backend и добавьте необходимые переменные окружения:

   ```env/backend
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

   ```env/frontend
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
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Локальная разработка:**

   Откройте два терминала или используйте вкладки в одном терминале.

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

Теперь проект будет доступен по адресу `http://localhost:3000`.

### Инструкция по деплою.

1. **Заходим в нужные директории:**

   ```sh
   cd backend
   cd frontend
   ```

2. **Запускаем сборку контейнеров в каждом терминале:**

   ```sh
   just docker-build
   ```

3. **Добавляем ключ гитлаба (один раз на сессию терминала, нужно каждый раз делать заново):**

   ```sh
   export GITLAB_TOKEN={token} ;export GITLAB_USER={user}
   ```

4. **Проверяем, что ключи добавились:**

   ```sh
   env
   ```
   В консоли должны увидеть наш ключ и имя пользователя

5. **Заливаем свежую сборку в GitLab (отдельно каждый контейнер):**

   ```sh
   just docker-push
   ```

6. **Собираем в продакшне:**

   ```sh
   cd ansible
   ansible-playbook -i inventory/prod.yaml playbooks/zoopolis.yaml 
   ```
   Эта команда собирает все контейнеры, отдельно собирать не нужно.

### Миграции в продакшне.

1. **После сборки заходим в контейнер:**

   ```sh
   docker exec -it zoopolis-backend-1 sh
   ```

2. **Проводим миграции:**

   ```sh
   python manage.py migrate
   ```

### Логи в продакшне.

1. **Логи фронтенда:**

   ```sh
   docker logs -f zoopolis-frontend-1
   ```

2. **Логи бекенда:**

   ```sh
   docker logs -f zoopolis-backend-1
   ```

3. **Логи сервера:**

   ```sh
   tail -f /var/log/angie/access.log
   ```