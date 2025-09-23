FROM python:3.13-alpine
WORKDIR /app
COPY requirements.txt .
RUN apk add iproute2-ss
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
./manage.py collectstatic -c --noinput &&
gunicorn --bind 0.0.0.0:8000 base.wsgi:application
EOT
RUN pip install gunicorn
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
ENTRYPOINT  ["./entrypoint.sh"]
