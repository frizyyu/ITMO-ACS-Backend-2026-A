# ЛР5. Настройка сервера и развёртывание средствами Ansible

Лабораторная работа переводит подготовку VPS и деплой Job Platform с shell-скриптов на Ansible.

## Компоненты

- `deploy/ansible/site.yml` — полная настройка нового Ubuntu-сервера;
- `deploy/ansible/deploy.yml` — обновление только приложения;
- `deploy/ansible/roles/` — роли `common`, `docker`, `firewall`, `nginx`, `app`;
- `deploy/scripts/setup-server.sh` — оболочка над `site.yml`;
- `deploy/scripts/deploy.sh` — оболочка над `deploy.yml`;
- `.github/workflows/deploy-lab5.yml` — CI/CD с Ansible.

## Локальный запуск

Для подключения к существующему серверу задайте переменные окружения:

```bash
export SSH_HOST=<server-ip>
export SSH_USER=root
export SSH_KEY=$HOME/.ssh/<deploy-key>
export JWT_SECRET_KEY=<secret>
export SERVICE_TOKEN=<secret>
export DB_PASSWORD=<secret>
export RABBITMQ_USER=<user>
export RABBITMQ_PASSWORD=<secret>

cd deploy/ansible
ansible-galaxy collection install -r requirements.yml
ansible-playbook site.yml
```

Для обновления уже настроенного сервера используется `deploy.yml`.

## Проверки

```bash
ansible-playbook site.yml --syntax-check
ansible-playbook deploy.yml --syntax-check
ansible-playbook site.yml --check --diff --skip-tags app
bash deploy/scripts/setup-server.sh
bash deploy/scripts/deploy.sh
```

Секреты не хранятся в git. При первом деплое `.env` создаётся на сервере с правами `0600`; существующий `.env` не перезаписывается.

## Nginx и VPN

ЛР5 не создаёт новый virtual host и не изменяет существующий Nginx-конфиг. На текущем сервере используется конфигурация:

- virtual host: `/etc/nginx/sites-enabled/smc-workspace`;
- locations-файл ЛР4: `/etc/nginx/snippets/job-platform-lab4.locations.conf`.

Ansible только проверяет наличие этих файлов и выполняет `nginx -t`. Это сохраняет VPN и остальные проксируемые сайты.

На текущем сервере также включён режим сохранения существующих системных компонентов: Ansible не меняет swap, UFW и Docker repository. Для настройки чистого сервера эти режимы можно отключить параметрами `common_preserve_existing=false`, `firewall_preserve_existing=false` и `docker_preserve_existing=false`.

Docker на текущем сервере также не переустанавливается: роль проверяет установленный Docker Engine и Compose plugin. Установку Docker для чистого сервера можно включить параметром `docker_preserve_existing=false`.
