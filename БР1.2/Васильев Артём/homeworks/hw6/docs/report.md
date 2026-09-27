# Отчет по ДЗ6

## Цель

Настроить GitHub Actions для автоматической проверки и развертывания Job Platform на удаленный сервер при обновлении `main`.

## Trigger

Workflow расположен в корневом `.github/workflows/deploy-hw6.yml`, поэтому GitHub распознает его. Автоматический trigger - push в ветку `main` с изменениями ДЗ6 или workflow. Для повторной проверки добавлен `workflow_dispatch`.

## CI

Матрица из семи jobs проверяет каждый микросервис:

1. `npm ci` устанавливает версии из lock-файла.
2. `npm run build` компилирует TypeScript.
3. `docker build` проверяет Dockerfile.

Отдельный job валидирует `docker-compose.yml`. Deploy job зависит от обеих проверок и не запускается при ошибке.

## CD

Deploy job:

1. подключается к Ubuntu-серверу по SSH-ключу;
2. клонирует репозиторий или обновляет checkout до `origin/main`;
3. создает `.env` из GitHub Actions Secrets;
4. валидирует Compose;
5. собирает образы последовательно из-за ограниченной RAM;
6. запускает Docker Compose и миграции;
7. проверяет dictionary-service локально и через Nginx;
8. выводит итоговый `docker compose ps`.

## Secrets

Для SSH используются `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`. Runtime-конфигурация передается через `JWT_SECRET_KEY`, `SERVICE_TOKEN`, `DB_PASSWORD`, `RABBITMQ_USER` и `RABBITMQ_PASSWORD`. В репозитории нет их значений.

## Проверка

После автодеплоя проверяются успешный GitHub Actions run, статусы контейнеров и HTTP 200 для `https://2.26.136.32/job-platform/api/v1/industries`.

## Вывод

Процесс от push в `main` до обновления приложения на удаленном сервере автоматизирован GitHub Actions. Деплой выполняется только после успешных CI-проверок.
