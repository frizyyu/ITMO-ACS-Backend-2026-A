# ДЗ6. CI/CD для Job Platform

ДЗ6 автоматизирует проверку и развертывание микросервисной Job Platform на сервер, подготовленный в ЛР4.

## Trigger

Workflow `.github/workflows/deploy-hw6.yml` запускается:

- автоматически при push в `main`, если изменились ДЗ6 или сам workflow;
- вручную через `workflow_dispatch`.

## Pipeline

1. Семь параллельных CI jobs выполняют `npm ci`, TypeScript build и Docker build каждого сервиса.
2. Отдельный job проверяет `docker compose config`.
3. Deploy job запускается только после успеха всех проверок.
4. GitHub Actions подключается к серверу по SSH-ключу, обновляет checkout и создает `.env` из Secrets.
5. Образы на сервере собираются последовательно, чтобы не перегрузить сервер с 2 ГБ RAM.
6. Compose запускает сервисы, затем выполняются миграции.
7. Pipeline делает локальный и внешний HTTP smoke-тест.

## GitHub Actions Secrets

- `SSH_HOST` - адрес сервера;
- `SSH_USER` - SSH-пользователь;
- `SSH_PRIVATE_KEY` - закрытый deploy-ключ;
- `JWT_SECRET_KEY` - ключ JWT;
- `SERVICE_TOKEN` - токен internal API;
- `DB_PASSWORD` - пароль PostgreSQL;
- `RABBITMQ_USER`, `RABBITMQ_PASSWORD` - учетные данны RabbitMQ.

Значения Secrets не хранятся в Git.

## Внешний URL

```text
https://2.26.136.32/job-platform/
```

Nginx настроен в ЛР4 и проксирует запросы к backend-портам, доступным только на `127.0.0.1`.
