FROM python:3.14-alpine
COPY --from=ghcr.io/astral-sh/uv:0.9.17 /uv /uvx /bin/
WORKDIR /app
COPY uv.lock .
COPY pyproject.toml .
RUN apk add iproute2-ss=6.17.0-r0 --no-cache && rm -rf /var/cache/apk/*
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
uv run manage.py collectstatic -c --noinput &&
uv run gunicorn --bind 0.0.0.0:8000 base.wsgi:application
EOT

ENV UV_NO_DEV=1
RUN uv sync --locked
COPY . .
EXPOSE 8000
ENTRYPOINT  ["./entrypoint.sh"]