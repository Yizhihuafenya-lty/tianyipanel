# 天依 Linux 面板
# Tianyi Linux Panel
# 天依 Linux パネル
# Panneau Linux Tianyi
# Панель Тяньи для Linux

一个用 Python 标准库实现的简易 Linux 服务器管理面板，无第三方运行时依赖。
A simple Linux server management panel built with the Python standard library, with no third-party runtime dependencies.
Python 標準ライブラリのみで実装したシンプルな Linux サーバー管理パネル。サードパーティのランタイム依存はありません。
Un panneau de gestion de serveur Linux simple, implémenté avec la bibliothèque standard de Python, sans dépendance d'exécution tierce.
Простая панель управления Linux-сервером на стандартной библиотеке Python, без сторонних зависимостей.

> 微型、功能齐全的 Linux 管理器，内存占用约 70MB。
> A tiny, fully-featured Linux manager, memory usage about 70 MB.
> 小型で高機能な Linux マネージャー。メモリ使用量は約 70MB。
> Un gestionnaire Linux miniature mais complet, environ 70 Mo de mémoire.
> Миниатюрный, но многофункциональный менеджер Linux, потребление памяти около 70 МБ.

## 功能
## Features
## 機能
## Fonctionnalités
## Возможности

- 系统概览：CPU、内存、磁盘、网络、负载、运行时间、电源状态（笔记本显示电池/充电，台式机显示市电，支持时显示功率）、传感器温度
- System overview: CPU, memory, disk, network, load, uptime, power status (battery/charging on laptops, mains on desktops, wattage when supported), sensor temperatures
- システム概要：CPU、メモリ、ディスク、ネットワーク、負荷、稼働時間、電源状態（ノートPCはバッテリー/充電、デスクトップはAC電源、対応時は消費電力を表示）、センサー温度
- Aperçu du système : CPU, mémoire, disque, réseau, charge, durée de fonctionnement, état d'alimentation (batterie/charge sur portable, secteur sur bureau, puissance si prise en charge), températures des capteurs
- Обзор системы: CPU, память, диск, сеть, нагрузка, время работы, состояние питания (батарея/зарядка на ноутбуке, сеть на ПК, мощность при поддержке), температура датчиков
- SSH 管理：端口/登录方式可视化配置，保存前 sshd -t 校验防锁机
- SSH management: visual port/login-method configuration, `sshd -t` validation before saving to prevent lockout
- SSH管理：ポート/ログイン方式のビジュアル設定。保存前に `sshd -t` で検証し、ロックアウトを防止
- Gestion SSH : configuration visuelle du port et de la méthode de connexion, validation `sshd -t` avant enregistrement pour éviter le verrouillage
- Управление SSH: визуальная настройка порта и способа входа, проверка `sshd -t` перед сохранением для защиты от блокировки
- 缓存清理：APT 缓存/journal 日志/临时文件一键清理，显示可释放空间
- Cache cleanup: one-click cleaning of APT cache / journal logs / temp files, showing reclaimable space
- キャッシュ削除：APTキャッシュ/ジャーナルログ/一時ファイルをワンクリック削除、解放可能な容量を表示
- Nettoyage du cache : nettoyage en un clic du cache APT / journaux journal / fichiers temporaires, avec espace libérable affiché
- Очистка кэша: очистка в один клик кэша APT / журналов journal / временных файлов, с отображением освобождаемого места
- 病毒扫描：ClamAV 一键安装、后台全盘扫描、自动更新病毒库、EICAR 检出实测通过
- Virus scanning: one-click ClamAV install, background full-disk scan, automatic virus-database updates, EICAR detection verified
- ウイルススキャン：ClamAVのワンクリックインストール、バックグラウンド全ディスクスキャン、ウイルス定義の自動更新、EICAR検出を実測確認済み
- Analyse antivirus : installation ClamAV en un clic, analyse complète du disque en arrière-plan, mise à jour automatique de la base virale, détection EICAR vérifiée
- Сканирование вирусов: установка ClamAV в один клик, фоновое сканирование диска, автообновление базы вирусов, обнаружение EICAR проверено
- 磁盘管理：块设备树 + 分区挂载点 + 空间使用进度条
- Disk management: block device tree + partition mount points + disk usage progress bars
- ディスク管理：ブロックデバイスツリー + パーティションのマウント先 + 使用量プログレスバー
- Gestion des disques : arborescence des périphériques bloc + points de montage + barres d'utilisation de l'espace
- Управление дисками: дерево блочных устройств + точки монтирования разделов + индикаторы использования
- 面板设置：访问验证码自定义（6 位数字）
- Panel settings: custom access code (6 digits)
- パネル設定：アクセスコードのカスタマイズ（6桁の数字）
- Paramètres du panneau : code d'accès personnalisable (6 chiffres)
- Настройки панели: свой код доступа (6 цифр)
- 进程管理：搜索、终止、强制终止
- Process management: search, terminate, force-kill
- プロセス管理：検索、終了、強制終了
- Gestion des processus : recherche, arrêt, arrêt forcé
- Управление процессами: поиск, завершение, принудительное завершение
- 服务管理：systemd 服务启停与重启
- Service management: start/stop/restart systemd services
- サービス管理：systemdサービスの開始/停止/再起動
- Gestion des services : démarrage, arrêt et redémarrage des services systemd
- Управление службами: запуск, остановка и перезапуск служб systemd
- 文件管理：浏览目录、查看文本文件、删除时移入回收站
- File management: browse directories, view text files, move to trash on delete
- ファイル管理：ディレクトリ参照、テキストファイル閲覧、削除時はゴミ箱へ移動
- Gestion des fichiers : parcourir les répertoires, consulter les fichiers texte, corbeille lors de la suppression
- Управление файлами: просмотр каталогов, чтение текстовых файлов, удаление в корзину
- 系统日志：journalctl 最近日志
- System logs: recent journalctl logs
- システムログ：journalctl の最近のログ
- Journaux système : journaux récents de journalctl
- Журналы системы: последние журналы journalctl
- 容器管理：容器/镜像/网络/存储卷/Compose 管理、日志查看、资源统计与 Web 控制台
- Container management: containers / images / networks / volumes / Compose, log viewing, resource stats and Web console
- コンテナ管理：コンテナ/イメージ/ネットワーク/ボリューム/Compose管理、ログ表示、リソース統計、Webコンソール
- Gestion des conteneurs : conteneurs / images / réseaux / volumes / Compose, consultation des journaux, statistiques et console Web
- Управление контейнерами: контейнеры / образы / сети / тома / Compose, просмотр журналов, статистика ресурсов и веб-консоль
- 防火墙管理：UFW 状态、规则增删、应用配置
- Firewall management: UFW status, rule add/remove, app profiles
- ファイアウォール管理：UFWの状態、ルールの追加/削除、アプリ設定
- Gestion du pare-feu : état UFW, ajout/suppression de règles, profils d'applications
- Управление брандмауэром: статус UFW, добавление/удаление правил, профили приложений
- Fail2ban：服务启停/重启、规则列表、封禁 IP 解封、一键安装
- Fail2ban: service start/stop/restart, jail list, unban IPs, one-click install
- Fail2ban：サービスの開始/停止/再起動、ルール一覧、IPの禁止解除、ワンクリックインストール
- Fail2ban : démarrage/arrêt/redémarrage, liste des règles, déblocage d'IP, installation en un clic
- Fail2ban: запуск/остановка/перезапуск, список правил, разблокировка IP, установка в один клик
- 应用商店：内置 200+ 常用应用，支持一键安装、检查更新、卸载；16 个热门 Docker 应用（MySQL/Redis/WordPress/Grafana/MinIO 等）支持参数化安装、启停、日志、数据卷备份、卸载，带官网文档链接
- App store: 200+ built-in common apps with one-click install, update check and uninstall; 16 popular Docker apps (MySQL/Redis/WordPress/Grafana/MinIO etc.) with parameterized install, start/stop, logs, volume backup, uninstall, plus official docs links
- アプリストア：200以上の一般的なアプリを内蔵、ワンクリックインストール/更新確認/アンインストールに対応。MySQL/Redis/WordPress/Grafana/MinIOなど人気のDockerアプリ16種はパラメータ付きインストール、起動/停止、ログ、データボリュームバックアップ、アンインストールに対応、公式ドキュメントリンク付き
- Magasin d'applications : 200+ applications courantes intégrées avec installation en un clic, vérification des mises à jour et désinstallation ; 16 applications Docker populaires (MySQL/Redis/WordPress/Grafana/MinIO, etc.) avec installation paramétrée, démarrage/arrêt, journaux, sauvegarde des volumes, désinstallation et liens vers la documentation officielle
- Магазин приложений: 200+ встроенных популярных приложений с установкой в один клик, проверкой обновлений и удалением; 16 популярных Docker-приложений (MySQL/Redis/WordPress/Grafana/MinIO и др.) с параметрической установкой, запуском/остановкой, журналами, резервным копированием томов, удалением и ссылками на официальную документацию
- 本地模型：Ollama 一键安装、模型库拉取、对话测试、GPU 监控
- Local models: one-click Ollama install, pull from model catalog, chat test, GPU monitoring
- ローカルモデル：Ollamaのワンクリックインストール、モデルカタログからの取得、対話テスト、GPU監視
- Modèles locaux : installation d'Ollama en un clic, tirage depuis le catalogue, test de chat, surveillance GPU
- Локальные модели: установка Ollama в один клик, загрузка из каталога, тест чата, мониторинг GPU
- 网站管理：Nginx 状态检测与一键安装、站点创建（静态/反向代理/PHP）、配置编辑、启停与删除
- Website management: Nginx status check and one-click install, site creation (static / reverse proxy / PHP), config editing, start/stop and delete
- ウェブサイト管理：Nginxの状態確認とワンクリックインストール、サイト作成（静的/リバースプロキシ/PHP）、設定編集、起動/停止/削除
- Gestion des sites : vérification de l'état Nginx et installation en un clic, création de sites (statique / proxy inverse / PHP), édition de la configuration, démarrage/arrêt et suppression
- Управление сайтами: проверка статуса Nginx и установка в один клик, создание сайтов (статический / обратный прокси / PHP), редактирование конфигурации, запуск/остановка и удаление
- SSL 证书：基于 acme.sh 一键签发 Let's Encrypt 免费证书，自动续签 + 自动部署到 Nginx 443
- SSL certificates: one-click Let's Encrypt free certificates via acme.sh, auto-renewal + auto-deploy to Nginx 443
- SSL証明書：acme.shによるLet's Encrypt無料証明書のワンクリック発行、自動更新 + Nginx 443への自動デプロイ
- Certificats SSL : certificats gratuits Let's Encrypt en un clic via acme.sh, renouvellement automatique + déploiement automatique sur Nginx 443
- SSL-сертификаты: бесплатные сертификаты Let's Encrypt в один клик через acme.sh, автопродление + автоматическое развертывание на Nginx 443
- 增强计划任务：Shell 脚本/目录备份/访问 URL 三种任务类型，支持执行日志、立即执行、启停
- Enhanced cron jobs: three task types (Shell script / directory backup / URL request), with execution logs, run-now and enable/disable
- 拡張スケジュールタスク：Shellスクリプト/ディレクトリバックアップ/URLアクセスの3種類、実行ログ、即時実行、有効/無効に対応
- Tâches planifiées avancées : trois types (script Shell / sauvegarde de répertoire / accès URL), journaux d'exécution, exécution immédiate, activation/désactivation
- Расширенный планировщик: три типа задач (Shell-скрипт / резервное копирование каталога / запрос URL), журналы выполнения, немедленный запуск, включение/отключение
- WebDAV 云存储：备份上传/取回/删除到 WebDAV 网盘
- WebDAV cloud storage: backup upload / retrieve / delete to WebDAV drives
- WebDAVクラウドストレージ：WebDAVへのバックアップアップロード/取得/削除
- Stockage cloud WebDAV : sauvegarde / récupération / suppression vers des disques WebDAV
- Облачное хранилище WebDAV: загрузка / получение / удаление резервных копий на WebDAV-диски
- 资源趋势：CPU/内存/网络历史曲线，支持 1小时/6小时/24小时/7天
- Resource trends: historical CPU/memory/network curves, 1h / 6h / 24h / 7d
- リソース傾向：CPU/メモリ/ネットワークの履歴グラフ、1時間/6時間/24時間/7日に対応
- Tendances des ressources : courbes historiques CPU/mémoire/réseau, 1h / 6h / 24h / 7j
- Тенденции ресурсов: исторические графики CPU/памяти/сети, 1 час / 6 часов / 24 часа / 7 дней
- 界面：应用商店一级菜单 + 分类索引、多主题、侧边栏收起与宽度调节
- UI: app store top-level menu + category index, multiple themes, collapsible sidebar with width adjustment
- 画面：アプリストアのトップメニュー + カテゴリ索引、マルチテーマ、サイドバーの折りたたみと幅調整
- Interface : menu principal du magasin + index des catégories, plusieurs thèmes, barre latérale repliable avec réglage de largeur
- Интерфейс: главное меню магазина + индекс категорий, несколько тем, сворачиваемая боковая панель с регулировкой ширины
- 登录验证：端口后 6 位访问验证码 + 服务器本机密码
- Login verification: 6-digit access code after the port + server local password
- ログイン認証：ポート後の6桁アクセスコード + サーバー本体のパスワード
- Vérification de connexion : code d'accès à 6 chiffres après le port + mot de passe local du serveur
- Проверка входа: 6-значный код доступа после порта + локальный пароль сервера
- 面板操作审计：记录操作时间、来源 IP、接口、详情、结果与耗时，支持筛选和清空
- Panel audit: records operation time, source IP, endpoint, details, result and duration, with filtering and clearing
- パネル操作監査：操作時間、送信元IP、エンドポイント、詳細、結果、所要時間を記録、フィルタとクリアに対応
- Audit du panneau : enregistre l'heure, l'IP source, le point d'accès, les détails, le résultat et la durée, avec filtrage et vidage
- Аудит панели: запись времени операции, IP источника, эндпоинта, деталей, результата и времени выполнения, с фильтрацией и очисткой
- 命令执行：默认关闭，需要手动开启
- Command execution: disabled by default, enable manually
- コマンド実行：デフォルト無効、手動で有効化が必要
- Exécution de commande : désactivée par défaut, à activer manuellement
- Выполнение команд: отключено по умолчанию, включается вручную

## 本地启动
## Local Startup
## ローカル起動
## Démarrage local
## Локальный запуск

```bash
python3 server.py --host 127.0.0.1 --port 8000
```

局域网访问并启用访问令牌：
For LAN access with an access token enabled:
LANアクセスとアクセストークンの有効化：
Pour un accès LAN avec jeton d'accès activé :
Доступ по LAN с включенным токеном доступа:

```bash
python3 server.py --host 0.0.0.0 --port 8000 --token auto
```

访问令牌会自动写入 `panel.token`。开启命令执行：
The access token is automatically written to `panel.token`. To enable command execution:
アクセストークンは自動的に `panel.token` に書き込まれます。コマンド実行を有効にするには：
Le jeton d'accès est automatiquement écrit dans `panel.token`. Pour activer l'exécution de commandes :
Токен доступа автоматически записывается в `panel.token`. Чтобы включить выполнение команд:

```bash
python3 server.py --host 0.0.0.0 --port 8000 --token auto --allow-command
```

如需面板操作受保护服务或 Docker，可在启动前设置环境变量：
If the panel needs to operate protected services or Docker, set this environment variable before starting:
パネルが保護されたサービスやDockerを操作する場合は、起動前に環境変数を設定してください：
Si le panneau doit gérer des services protégés ou Docker, définissez cette variable d'environnement avant le démarrage :
Если панели нужно работать с защищёнными службами или Docker, задайте переменную окружения перед запуском:

```bash
export PANEL_SUDO_PASSWORD='你的 sudo 密码'
```

当前用户不在 docker 组时，面板会自动通过 sudo 执行 docker 命令，因此需要提前配置
`PANEL_SUDO_PASSWORD`。Compose 文件保存在 `~/.panel-compose`，删除项目时移入
`~/.panel-compose-trash`。
When the current user is not in the docker group, the panel automatically runs docker commands via sudo, so `PANEL_SUDO_PASSWORD` must be configured in advance. Compose files are stored in `~/.panel-compose`; deleted projects move to `~/.panel-compose-trash`.
現在のユーザーがdockerグループに属していない場合、パネルはsudo経由でdockerコマンドを実行するため、事前に `PANEL_SUDO_PASSWORD` を設定する必要があります。Composeファイルは `~/.panel-compose` に保存され、プロジェクト削除時は `~/.panel-compose-trash` に移動します。
Lorsque l'utilisateur actuel n'est pas dans le groupe docker, le panneau exécute automatiquement les commandes docker via sudo, donc `PANEL_SUDO_PASSWORD` doit être configuré à l'avance. Les fichiers Compose sont stockés dans `~/.panel-compose` ; les projets supprimés vont dans `~/.panel-compose-trash`.
Если текущий пользователь не входит в группу docker, панель автоматически выполняет команды docker через sudo, поэтому необходимо заранее настроить `PANEL_SUDO_PASSWORD`. Файлы Compose хранятся в `~/.panel-compose`, удалённые проекты перемещаются в `~/.panel-compose-trash`.

命令执行开启后，每次执行前都会用 `sudo` 校验一次服务器本机密码，密码不落盘。
When command execution is enabled, the server's local password is verified once via `sudo` before each execution; the password is never stored on disk.
コマンド実行を有効にすると、毎回の実行前に `sudo` でサーバーのパスワードを一度検証します。パスワードはディスクに保存されません。
Lorsque l'exécution de commandes est activée, le mot de passe local du serveur est vérifié via `sudo` avant chaque exécution ; il n'est jamais stocké sur disque.
Когда выполнение команд включено, перед каждым запуском локальный пароль сервера проверяется через `sudo`; пароль никогда не сохраняется на диск.

## 登录与二次验证
## Login and Two-Step Verification
## ログインと二段階認証
## Connexion et double vérification
## Вход и двухэтапная проверка

- 面板登录地址为 `http://服务器IP:8000/<6位验证码>`，验证码保存在服务器
  `~/panel/panel.verify`，也可通过 `PANEL_ACCESS_CODE` 环境变量指定。
- The panel login URL is `http://服务器IP:8000/<6-digit code>`; the code is stored
  on the server at `~/panel/panel.verify`, or can be set via the `PANEL_ACCESS_CODE` environment variable.
- パネルのログインURLは `http://サーバーIP:8000/<6桁コード>` です。コードはサーバーの
  `~/panel/panel.verify` に保存され、環境変数 `PANEL_ACCESS_CODE` でも指定できます。
- L'URL de connexion du panneau est `http://IPserveur:8000/<code à 6 chiffres>` ; le code est stocké
  sur le serveur dans `~/panel/panel.verify`, ou peut être défini via la variable d'environnement `PANEL_ACCESS_CODE`.
- URL входа в панель: `http://IP-сервера:8000/<6-значный код>`; код хранится на сервере
  в `~/panel/panel.verify` или задаётся через переменную окружения `PANEL_ACCESS_CODE`.
- 首次登录需要同时输入 6 位验证码和服务器本机密码。
- First login requires both the 6-digit code and the server's local password.
- 初回ログイン時は6桁コードとサーバーのパスワードの両方が必要です。
- La première connexion requiert à la fois le code à 6 chiffres et le mot de passe local du serveur.
- При первом входе требуются и 6-значный код, и локальный пароль сервера.
- 所有改动类操作（增删规则、启停服务、容器操作等）都会再次请求本机密码，
  密码仅用于本次请求校验，不落盘。
- All modifying operations (add/remove rules, start/stop services, container operations, etc.) request the local password again; the password is only used to verify that request and is never stored.
- 変更を伴う操作（ルールの追加/削除、サービスの開始/停止、コンテナ操作など）は毎回ローカルパスワードを要求します。パスワードはそのリクエストの検証にのみ使用され、保存されません。
- Toutes les opérations de modification (ajout/suppression de règles, démarrage/arrêt de services, opérations sur les conteneurs, etc.) redemandent le mot de passe local ; il n'est utilisé que pour cette requête et n'est jamais stocké.
- Все изменяющие операции (добавление/удаление правил, запуск/остановка служб, операции с контейнерами и т.д.) снова запрашивают локальный пароль; он используется только для проверки этого запроса и нигде не сохраняется.

## 本地模型
## Local Models
## ローカルモデル
## Modèles locaux
## Локальные модели

- 模型页提供 Ollama 一键安装（自动处理国内网络镜像与 zstd 依赖）。
- The models page offers one-click Ollama installation (handles domestic network mirrors and zstd dependencies automatically).
- モデルページではOllamaのワンクリックインストールを提供します（国内ネットワークミラーとzstd依存を自動処理）。
- La page modèles propose l'installation d'Ollama en un clic (gère automatiquement les miroirs réseau locaux et la dépendance zstd).
- Страница моделей предлагает установку Ollama в один клик (автоматически обрабатывает локальные сетевые зеркала и зависимость zstd).
- 模型库内置常用 Ollama 模型，支持搜索和一键拉取，也可手动输入模型名拉取。
- The model catalog includes common Ollama models with search and one-click pull; you can also type a model name manually.
- モデルカタログには一般的なOllamaモデルが内蔵され、検索とワンクリック取得に対応。モデル名を手動入力して取得することもできます。
- Le catalogue intègre des modèles Ollama courants avec recherche et tirage en un clic ; vous pouvez aussi saisir un nom de modèle manuellement.
- Каталог содержит популярные модели Ollama с поиском и загрузкой в один клик; можно также ввести имя модели вручную.
- 模型默认存放在 `~/.ollama/models`，安装时会同步配置 Ollama 服务使用该目录。
- Models are stored in `~/.ollama/models` by default; installation also configures the Ollama service to use this directory.
- モデルはデフォルトで `~/.ollama/models` に保存され、インストール時にOllamaサービスもこのディレクトリを使用するよう設定されます。
- Les modèles sont stockés dans `~/.ollama/models` par défaut ; l'installation configure aussi le service Ollama pour utiliser ce répertoire.
- Модели по умолчанию хранятся в `~/.ollama/models`; при установке служба Ollama также настраивается на использование этого каталога.
- 支持对话测试、删除模型、查看运行中模型。
- Supports chat testing, model deletion, and viewing running models.
- 対話テスト、モデル削除、実行中モデルの表示に対応。
- Prend en charge le test de chat, la suppression de modèles et l'affichage des modèles en cours.
- Поддерживает тест чата, удаление моделей и просмотр запущенных моделей.
- GPU 监控支持 NVIDIA 显卡的利用率、显存、温度、功耗曲线；无 NVIDIA 显卡时
  页面会明确提示。
- GPU monitoring supports NVIDIA GPU utilization, VRAM, temperature and power curves; a clear notice appears when no NVIDIA GPU is present.
- GPU監視はNVIDIA GPUの使用率、VRAM、温度、消費電力のグラフに対応。NVIDIA GPUがない場合はページに明確に表示されます。
- La surveillance GPU prend en charge l'utilisation, la VRAM, la température et la puissance des cartes NVIDIA ; un avertissement clair s'affiche en l'absence de GPU NVIDIA.
- Мониторинг GPU поддерживает графики использования, видеопамяти, температуры и мощности NVIDIA; при отсутствии NVIDIA GPU на странице отображается понятное уведомление.

## 部署脚本
## Deployment Script
## デプロイスクリプト
## Script de déploiement
## Скрипт развертывания

Windows 上需要先安装 Paramiko（仅部署机需要）：
On Windows, install Paramiko first (only needed on the deployment machine):
Windowsでは先にParamikoをインストールしてください（デプロイマシンのみ必要）：
Sur Windows, installez d'abord Paramiko (uniquement sur la machine de déploiement) :
На Windows сначала установите Paramiko (нужно только на машине развертывания):

```powershell
python -m pip install paramiko
$env:PANEL_SSH_PASS = "服务器密码"
python deploy.py --host 192.168.3.251 --user lty --allow-command
```

默认将代码上传到服务器 `~/panel` 并启动，端口为 8000。
By default, the code is uploaded to `~/panel` on the server and started on port 8000.
デフォルトではコードはサーバーの `~/panel` にアップロードされ、ポート8000で起動します。
Par défaut, le code est téléversé vers `~/panel` sur le serveur et démarré sur le port 8000.
По умолчанию код загружается на сервер в `~/panel` и запускается на порту 8000.

## 安全说明
## Security Notes
## セキュリティ注意事項
## Notes de sécurité
## Примечания по безопасности

- 非本机监听时自动启用访问令牌，请勿关闭或外泄
- The access token is enabled automatically when listening beyond localhost; do not disable or leak it
- ローカル以外で待ち受けする場合、アクセストークンが自動的に有効になります。無効化や漏洩はしないでください
- Le jeton d'accès s'active automatiquement en écoute hors localhost ; ne le désactivez pas et ne le divulguez pas
- При прослушивании не только localhost токен доступа включается автоматически; не отключайте и не разглашайте его
- 危险操作均有二次确认
- Dangerous operations require a second confirmation
- 危険な操作にはすべて再確認が必要です
- Les opérations dangereuses exigent une double confirmation
- Опасные операции требуют повторного подтверждения
- 文件删除是移动到 `~/.panel-trash`，不是直接删除
- File deletion moves files to `~/.panel-trash`, not permanent deletion
- ファイル削除は `~/.panel-trash` への移動であり、完全削除ではありません
- La suppression déplace les fichiers vers `~/.panel-trash`, ce n'est pas une suppression définitive
- Удаление файлов перемещает их в `~/.panel-trash`, а не удаляет окончательно
- 命令执行默认关闭，仅在测试环境按需开启
- Command execution is disabled by default; enable it only when needed in test environments
- コマンド実行はデフォルト無効です。テスト環境で必要な場合のみ有効化してください
- L'exécution de commandes est désactivée par défaut ; à activer uniquement en environnement de test
- Выполнение команд отключено по умолчанию; включайте только при необходимости в тестовых средах

## 免责声明
## Disclaimer
## 免責事項
## Avertissement
## Отказ от ответственности

本项目按"现状"提供，使用风险自负。多语言（中/英/日/法/俄）免责声明见 [DISCLAIMER.md](DISCLAIMER.md)。
This project is provided "AS IS" at your own risk. See [DISCLAIMER.md](DISCLAIMER.md) for the disclaimer in multiple languages (Chinese/English/Japanese/French/Russian).
本プロジェクトは「現状のまま」提供され、利用は自己責任です。多言語（中国語/英語/日本語/フランス語/ロシア語）の免責事項は [DISCLAIMER.md](DISCLAIMER.md) をご覧ください。
Ce projet est fourni « tel quel », à vos propres risques. Voir [DISCLAIMER.md](DISCLAIMER.md) pour l'avertissement multilingue (chinois/anglais/japonais/français/russe).
Проект предоставляется «как есть», использование на свой риск. Многоязычный (кит./англ./яп./фр./рус.) отказ от ответственности — в [DISCLAIMER.md](DISCLAIMER.md).
