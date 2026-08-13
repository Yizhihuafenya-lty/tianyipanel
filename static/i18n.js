/* 天依面板 多语言支持 (i18n)
 * 语言选择器提供 22 种语言；
 * 中/英/日/法/俄 5 种语言有完整翻译，其余语言自动回退中文。
 * 通过 MutationObserver 自动翻译静态与动态文本，无需改动 app.js。
 */
(function () {
  "use strict";

  /* ---------- 语言清单（22 种） ---------- */
  var I18N_LANGS = [
    ["zh-CN", "简体中文"],
    ["zh-TW", "繁體中文"],
    ["en", "English"],
    ["ja", "日本語"],
    ["ko", "한국어"],
    ["fr", "Français"],
    ["de", "Deutsch"],
    ["es", "Español"],
    ["pt", "Português"],
    ["ru", "Русский"],
    ["it", "Italiano"],
    ["nl", "Nederlands"],
    ["pl", "Polski"],
    ["tr", "Türkçe"],
    ["vi", "Tiếng Việt"],
    ["th", "ไทย"],
    ["id", "Bahasa Indonesia"],
    ["ar", "العربية"],
    ["hi", "हिन्दी"],
    ["uk", "Українська"],
    ["cs", "Čeština"],
    ["sv", "Svenska"]
  ];

  /* ---------- 翻译字典：中文原文 -> {en, ja, fr, ru} ---------- */
  var I18N_DICT = {
    /* 品牌 */
    "天依面板": { en: "Tianyi Panel", ja: "天依パネル", fr: "Panneau Tianyi", ru: "Панель Тяньи" },
    "天依 Linux 面板": { en: "Tianyi Linux Panel", ja: "天依 Linux パネル", fr: "Panneau Linux Tianyi", ru: "Панель Тяньи для Linux" },
    /* 导航 */
    "概览": { en: "Overview", ja: "概要", fr: "Aperçu", ru: "Обзор" },
    "进程": { en: "Processes", ja: "プロセス", fr: "Processus", ru: "Процессы" },
    "守护": { en: "Guard", ja: "監視", fr: "Garde", ru: "Охрана" },
    "服务": { en: "Services", ja: "サービス", fr: "Services", ru: "Службы" },
    "数据库": { en: "Database", ja: "データベース", fr: "Base de données", ru: "База данных" },
    "网站": { en: "Websites", ja: "ウェブサイト", fr: "Sites Web", ru: "Веб-сайты" },
    "防火墙": { en: "Firewall", ja: "ファイアウォール", fr: "Pare-feu", ru: "Брандмауэр" },
    "模型": { en: "Models", ja: "モデル", fr: "Modèles", ru: "Модели" },
    "应用": { en: "Apps", ja: "アプリ", fr: "Applications", ru: "Приложения" },
    "文件": { en: "Files", ja: "ファイル", fr: "Fichiers", ru: "Файлы" },
    "终端": { en: "Terminal", ja: "ターミナル", fr: "Terminal", ru: "Терминал" },
    "工具箱": { en: "Toolbox", ja: "ツールボックス", fr: "Boîte à outils", ru: "Инструменты" },
    "命令": { en: "Command", ja: "コマンド", fr: "Commande", ru: "Команда" },
    /* 顶栏 */
    "菜单宽度": { en: "Menu width", ja: "メニュー幅", fr: "Largeur du menu", ru: "Ширина меню" },
    "连接中...": { en: "Connecting...", ja: "接続中...", fr: "Connexion...", ru: "Подключение..." },
    "主题": { en: "Theme", ja: "テーマ", fr: "Thème", ru: "Тема" },
    "自动刷新": { en: "Auto refresh", ja: "自動更新", fr: "Actualisation auto", ru: "Автообновление" },
    "刷新": { en: "Refresh", ja: "更新", fr: "Actualiser", ru: "Обновить" },
    "设置": { en: "Settings", ja: "設定", fr: "Paramètres", ru: "Настройки" },
    "登录": { en: "Login", ja: "ログイン", fr: "Connexion", ru: "Вход" },
    "语言": { en: "Language", ja: "言語", fr: "Langue", ru: "Язык" },
    /* 主题选项 */
    "深空": { en: "Deep Space", ja: "ディープスペース", fr: "Espace profond", ru: "Глубокий космос" },
    "海盐": { en: "Sea Salt", ja: "シーソルト", fr: "Sel de mer", ru: "Морская соль" },
    "深海": { en: "Deep Sea", ja: "深海", fr: "Haute mer", ru: "Глубокое море" },
    "琥珀": { en: "Amber", ja: "琥珀", fr: "Ambre", ru: "Янтарь" },
    /* 刷新间隔 / 时间 */
    "关闭": { en: "Off", ja: "オフ", fr: "Désactivé", ru: "Выкл." },
    "1 秒": { en: "1 s", ja: "1秒", fr: "1 s", ru: "1 сек" },
    "5 秒": { en: "5 s", ja: "5秒", fr: "5 s", ru: "5 сек" },
    "10 秒": { en: "10 s", ja: "10秒", fr: "10 s", ru: "10 сек" },
    "30 秒": { en: "30 s", ja: "30秒", fr: "30 s", ru: "30 сек" },
    "60 秒": { en: "60 s", ja: "60秒", fr: "60 s", ru: "60 сек" },
    "1 小时": { en: "1 h", ja: "1時間", fr: "1 h", ru: "1 час" },
    "6 小时": { en: "6 h", ja: "6時間", fr: "6 h", ru: "6 часов" },
    "24 小时": { en: "24 h", ja: "24時間", fr: "24 h", ru: "24 часа" },
    "7 天": { en: "7 days", ja: "7日", fr: "7 jours", ru: "7 дней" },
    /* 概览页 */
    "资源趋势": { en: "Resource Trends", ja: "リソース傾向", fr: "Tendances des ressources", ru: "Тенденции ресурсов" },
    "CPU 使用率 %": { en: "CPU Usage %", ja: "CPU使用率 %", fr: "Utilisation CPU %", ru: "Использование CPU %" },
    "内存使用率 %": { en: "Memory Usage %", ja: "メモリ使用率 %", fr: "Utilisation mémoire %", ru: "Использование памяти %" },
    "网络速率": { en: "Network Rate", ja: "ネットワーク速度", fr: "Débit réseau", ru: "Скорость сети" },
    "系统信息": { en: "System Info", ja: "システム情報", fr: "Infos système", ru: "Информация о системе" },
    "磁盘": { en: "Disks", ja: "ディスク", fr: "Disques", ru: "Диски" },
    "网络总量": { en: "Network Total", ja: "ネットワーク合計", fr: "Réseau total", ru: "Сетевой трафик" },
    /* 进程页 */
    "全部": { en: "All", ja: "すべて", fr: "Tout", ru: "Все" },
    "系统进程": { en: "System", ja: "システム", fr: "Système", ru: "Системные" },
    "软件": { en: "Apps", ja: "ソフトウェア", fr: "Logiciels", ru: "Приложения" },
    "搜索进程名或 PID": { en: "Search by name or PID", ja: "名前またはPIDで検索", fr: "Rechercher par nom ou PID", ru: "Поиск по имени или PID" },
    "进程列表": { en: "Process List", ja: "プロセス一覧", fr: "Liste des processus", ru: "Список процессов" },
    "类型": { en: "Type", ja: "種類", fr: "Type", ru: "Тип" },
    "用户": { en: "User", ja: "ユーザー", fr: "Utilisateur", ru: "Пользователь" },
    "耗电": { en: "Power", ja: "消費電力", fr: "Énergie", ru: "Энергия" },
    "状态": { en: "Status", ja: "状態", fr: "État", ru: "Статус" },
    "运行时长": { en: "Uptime", ja: "稼働時間", fr: "Durée", ru: "Время работы" },
    "操作": { en: "Actions", ja: "操作", fr: "Actions", ru: "Действия" },
    /* 守护页 */
    "添加守护": { en: "Add Guard", ja: "監視を追加", fr: "Ajouter une garde", ru: "Добавить охрану" },
    "从运行进程添加": { en: "Add from running", ja: "実行中プロセスから追加", fr: "Ajouter depuis les processus", ru: "Добавить из процессов" },
    "进程守护": { en: "Process Guard", ja: "プロセス監視", fr: "Garde de processus", ru: "Охрана процессов" },
    "名称": { en: "Name", ja: "名前", fr: "Nom", ru: "Имя" },
    "匹配规则": { en: "Match Rule", ja: "マッチルール", fr: "Règle de correspondance", ru: "Правило сопоставления" },
    "守护": { en: "Guarded", ja: "監視", fr: "Gardé", ru: "Охраняется" },
    "重启次数": { en: "Restarts", ja: "再起動回数", fr: "Redémarrages", ru: "Перезапуски" },
    "上次重启": { en: "Last Restart", ja: "前回の再起動", fr: "Dernier redémarrage", ru: "Последний перезапуск" },
    /* 服务页 */
    "搜索服务名": { en: "Search service name", ja: "サービス名を検索", fr: "Rechercher un service", ru: "Поиск службы" },
    "systemd 服务": { en: "systemd Services", ja: "systemdサービス", fr: "Services systemd", ru: "Службы systemd" },
    "单元": { en: "Unit", ja: "ユニット", fr: "Unité", ru: "Модуль" },
    "描述": { en: "Description", ja: "説明", fr: "Description", ru: "Описание" },
    "活动状态": { en: "Active", ja: "アクティブ状態", fr: "État actif", ru: "Активность" },
    "子状态": { en: "Sub-state", ja: "サブ状態", fr: "Sous-état", ru: "Подсостояние" },
    "开机启动": { en: "Enabled", ja: "自動起動", fr: "Au démarrage", ru: "Автозапуск" },
    /* 文件页 */
    "上级目录": { en: "Parent directory", ja: "親ディレクトリ", fr: "Dossier parent", ru: "Родительская папка" },
    "打开": { en: "Open", ja: "開く", fr: "Ouvrir", ru: "Открыть" },
    "删除会先移入回收站目录": { en: "Deleted files go to the trash first", ja: "削除ファイルはまずゴミ箱へ移動", fr: "Les fichiers supprimés vont d'abord à la corbeille", ru: "Удалённые файлы сначала попадают в корзину" },
    "上传": { en: "Upload", ja: "アップロード", fr: "Téléverser", ru: "Загрузить" },
    "新建目录": { en: "New Folder", ja: "新しいフォルダ", fr: "Nouveau dossier", ru: "Новая папка" },
    "在线下载": { en: "Download URL", ja: "URLからダウンロード", fr: "Télécharger par URL", ru: "Скачать по URL" },
    "压缩": { en: "Archive", ja: "圧縮", fr: "Archiver", ru: "Архивировать" },
    "解压": { en: "Extract", ja: "解凍", fr: "Extraire", ru: "Распаковать" },
    "权限": { en: "Permissions", ja: "権限", fr: "Permissions", ru: "Права" },
    "属主": { en: "Owner", ja: "所有者", fr: "Propriétaire", ru: "Владелец" },
    "修改时间": { en: "Modified", ja: "更新日時", fr: "Modifié", ru: "Изменён" },
    /* 工具箱 tabs */
    "计划任务": { en: "Cron Jobs", ja: "スケジュールタスク", fr: "Tâches planifiées", ru: "Планировщик" },
    "SSH日志": { en: "SSH Logs", ja: "SSHログ", fr: "Journaux SSH", ru: "Журналы SSH" },
    "容器": { en: "Containers", ja: "コンテナ", fr: "Conteneurs", ru: "Контейнеры" },
    "网站统计": { en: "Analytics", ja: "サイト統計", fr: "Statistiques", ru: "Статистика" },
    "防篡改": { en: "Tamper Protection", ja: "改ざん防止", fr: "Anti-altération", ru: "Защита от изменений" },
    "备份": { en: "Backup", ja: "バックアップ", fr: "Sauvegarde", ru: "Резервное копирование" },
    "日志": { en: "Logs", ja: "ログ", fr: "Journaux", ru: "Журналы" },
    "审计": { en: "Audit", ja: "監査", fr: "Audit", ru: "Аудит" },
    "SSH 管理": { en: "SSH Management", ja: "SSH管理", fr: "Gestion SSH", ru: "Управление SSH" },
    "清理": { en: "Cleanup", ja: "クリーンアップ", fr: "Nettoyage", ru: "Очистка" },
    "病毒扫描": { en: "Virus Scan", ja: "ウイルススキャン", fr: "Analyse antivirus", ru: "Сканирование вирусов" },
    "告警": { en: "Alerts", ja: "アラート", fr: "Alertes", ru: "Оповещения" },
    /* 工具箱内容 */
    "解析": { en: "Resolve", ja: "解決", fr: "Résoudre", ru: "Разрешить" },
    "等待解析": { en: "Waiting to resolve", ja: "解決待ち", fr: "En attente", ru: "Ожидание" },
    "新建任务": { en: "New Task", ja: "新しいタスク", fr: "Nouvelle tâche", ru: "Новая задача" },
    "任务名": { en: "Task Name", ja: "タスク名", fr: "Nom de la tâche", ru: "Имя задачи" },
    "执行周期": { en: "Schedule", ja: "実行周期", fr: "Planification", ru: "Расписание" },
    "上次执行": { en: "Last Run", ja: "前回実行", fr: "Dernière exécution", ru: "Последний запуск" },
    "原生 crontab": { en: "Raw crontab", ja: "生のcrontab", fr: "crontab brut", ru: "Оригинальный crontab" },
    "添加行": { en: "Add Line", ja: "行を追加", fr: "Ajouter une ligne", ru: "Добавить строку" },
    "内容": { en: "Content", ja: "内容", fr: "Contenu", ru: "Содержимое" },
    "登录成功": { en: "Success", ja: "ログイン成功", fr: "Réussies", ru: "Успешные" },
    "登录失败": { en: "Failed", ja: "ログイン失敗", fr: "Échouées", ru: "Неудачные" },
    "SSH 登录日志": { en: "SSH Login Logs", ja: "SSHログインログ", fr: "Journaux de connexion SSH", ru: "Журналы входа SSH" },
    "时间": { en: "Time", ja: "時間", fr: "Heure", ru: "Время" },
    "事件": { en: "Event", ja: "イベント", fr: "Événement", ru: "Событие" },
    "IP": { en: "IP", ja: "IP", fr: "IP", ru: "IP" },
    "详情": { en: "Details", ja: "詳細", fr: "Détails", ru: "Подробности" },
    "新建容器": { en: "New Container", ja: "新しいコンテナ", fr: "Nouveau conteneur", ru: "Новый контейнер" },
    "拉取镜像": { en: "Pull Image", ja: "イメージを取得", fr: "Tirer l'image", ru: "Загрузить образ" },
    "新建 Compose": { en: "New Compose", ja: "新しいCompose", fr: "Nouveau Compose", ru: "Новый Compose" },
    "镜像": { en: "Images", ja: "イメージ", fr: "Images", ru: "Образы" },
    "网络": { en: "Networks", ja: "ネットワーク", fr: "Réseaux", ru: "Сети" },
    "卷": { en: "Volumes", ja: "ボリューム", fr: "Volumes", ru: "Тома" },
    "资源": { en: "Stats", ja: "リソース", fr: "Ressources", ru: "Ресурсы" },
    "实时监控": { en: "Realtime", ja: "リアルタイム", fr: "Temps réel", ru: "В реальном времени" },
    "访客趋势": { en: "Visitor Trend", ja: "訪問者傾向", fr: "Tendance visiteurs", ru: "Тенденция посетителей" },
    "访客来源": { en: "Sources", ja: "訪問元", fr: "Sources", ru: "Источники" },
    "访问统计": { en: "Statistics", ja: "アクセス統計", fr: "Statistiques", ru: "Статистика" },
    "请求日志": { en: "Requests", ja: "リクエストログ", fr: "Requêtes", ru: "Запросы" },
    "端口监控": { en: "Ports", ja: "ポート監視", fr: "Ports", ru: "Порты" },
    "保存": { en: "Save", ja: "保存", fr: "Enregistrer", ru: "Сохранить" },
    "初始化基线": { en: "Init Baseline", ja: "ベースライン初期化", fr: "Initialiser la base", ru: "Инициализировать базу" },
    "立即扫描": { en: "Scan Now", ja: "今すぐスキャン", fr: "Analyser maintenant", ru: "Сканировать сейчас" },
    "异常文件": { en: "Anomalies", ja: "異常ファイル", fr: "Anomalies", ru: "Аномалии" },
    "权限风险": { en: "Permission Risks", ja: "権限リスク", fr: "Risques de permissions", ru: "Риски прав" },
    "审计日志": { en: "Audit Logs", ja: "監査ログ", fr: "Journaux d'audit", ru: "Журналы аудита" },
    "新建备份": { en: "New Backup", ja: "新しいバックアップ", fr: "Nouvelle sauvegarde", ru: "Новая резервная копия" },
    "备份目录 ~/.panel-backups": { en: "Backup dir ~/.panel-backups", ja: "バックアップ先 ~/.panel-backups", fr: "Répertoire ~/.panel-backups", ru: "Каталог ~/.panel-backups" },
    "备份列表": { en: "Backup List", ja: "バックアップ一覧", fr: "Liste des sauvegardes", ru: "Список копий" },
    "云端备份（WebDAV）": { en: "Cloud Backup (WebDAV)", ja: "クラウドバックアップ（WebDAV）", fr: "Sauvegarde cloud (WebDAV)", ru: "Облачная копия (WebDAV)" },
    "未配置": { en: "Not configured", ja: "未設定", fr: "Non configuré", ru: "Не настроено" },
    "云存储设置": { en: "Cloud Storage Settings", ja: "クラウド設定", fr: "Paramètres cloud", ru: "Настройки облака" },
    "测试连接": { en: "Test Connection", ja: "接続テスト", fr: "Tester la connexion", ru: "Проверить соединение" },
    "刷新云端列表": { en: "Refresh Cloud List", ja: "クラウド一覧を更新", fr: "Actualiser la liste cloud", ru: "Обновить список" },
    "未配置云存储": { en: "Cloud storage not configured", ja: "クラウド未設定", fr: "Stockage cloud non configuré", ru: "Облако не настроено" },
    "过滤日志内容": { en: "Filter log content", ja: "ログをフィルタ", fr: "Filtrer les journaux", ru: "Фильтр журнала" },
    "100 行": { en: "100 lines", ja: "100行", fr: "100 lignes", ru: "100 строк" },
    "200 行": { en: "200 lines", ja: "200行", fr: "200 lignes", ru: "200 строк" },
    "500 行": { en: "500 lines", ja: "500行", fr: "500 lignes", ru: "500 строк" },
    "1000 行": { en: "1000 lines", ja: "1000行", fr: "1000 lignes", ru: "1000 строк" },
    "100 条": { en: "100", ja: "100件", fr: "100", ru: "100" },
    "200 条": { en: "200", ja: "200件", fr: "200", ru: "200" },
    "500 条": { en: "500", ja: "500件", fr: "500", ru: "500" },
    "1000 条": { en: "1000", ja: "1000件", fr: "1000", ru: "1000" },
    "系统日志": { en: "System Logs", ja: "システムログ", fr: "Journaux système", ru: "Журналы системы" },
    "加载中...": { en: "Loading...", ja: "読み込み中...", fr: "Chargement...", ru: "Загрузка..." },
    "清空": { en: "Clear", ja: "クリア", fr: "Vider", ru: "Очистить" },
    "记录目录 ~/.panel-audit/operations.log": { en: "Log dir ~/.panel-audit/operations.log", ja: "ログ先 ~/.panel-audit/operations.log", fr: "Répertoire ~/.panel-audit/operations.log", ru: "Каталог ~/.panel-audit/operations.log" },
    "面板操作审计": { en: "Panel Operation Audit", ja: "パネル操作監査", fr: "Audit des opérations", ru: "Аудит операций" },
    "来源 IP": { en: "Source IP", ja: "送信元IP", fr: "IP source", ru: "IP источника" },
    "结果": { en: "Result", ja: "結果", fr: "Résultat", ru: "Результат" },
    "耗时": { en: "Duration", ja: "所要時間", fr: "Durée", ru: "Время" },
    "SSH 端口": { en: "SSH Port", ja: "SSHポート", fr: "Port SSH", ru: "Порт SSH" },
    "允许 root 登录": { en: "Allow root login", ja: "rootログインを許可", fr: "Autoriser root", ru: "Разрешить root" },
    "允许": { en: "Allow", ja: "許可", fr: "Autoriser", ru: "Разрешить" },
    "仅密钥": { en: "Key only", ja: "鍵のみ", fr: "Clé uniquement", ru: "Только ключ" },
    "禁止": { en: "Deny", ja: "禁止", fr: "Interdire", ru: "Запретить" },
    "禁止（仅密钥）": { en: "Deny (key only)", ja: "禁止（鍵のみ）", fr: "Interdire (clé)", ru: "Запретить (ключ)" },
    "密码登录": { en: "Password login", ja: "パスワードログイン", fr: "Connexion par mot de passe", ru: "Вход по паролю" },
    "保存并重启 SSH": { en: "Save & Restart SSH", ja: "保存してSSH再起動", fr: "Enregistrer et redémarrer SSH", ru: "Сохранить и перезапустить SSH" },
    "缓存清理": { en: "Cache Cleanup", ja: "キャッシュ削除", fr: "Nettoyage du cache", ru: "Очистка кэша" },
    "清理选中项": { en: "Clean Selected", ja: "選択項目を削除", fr: "Nettoyer la sélection", ru: "Очистить выбранное" },
    "病毒扫描（ClamAV）": { en: "Virus Scan (ClamAV)", ja: "ウイルススキャン（ClamAV）", fr: "Analyse antivirus (ClamAV)", ru: "Сканирование (ClamAV)" },
    "检测中": { en: "Checking", ja: "確認中", fr: "Vérification", ru: "Проверка" },
    "安装 ClamAV": { en: "Install ClamAV", ja: "ClamAVをインストール", fr: "Installer ClamAV", ru: "Установить ClamAV" },
    "扫描路径": { en: "Scan Path", ja: "スキャン先", fr: "Chemin d'analyse", ru: "Путь сканирования" },
    "开始扫描": { en: "Start Scan", ja: "スキャン開始", fr: "Lancer l'analyse", ru: "Начать сканирование" },
    "块设备": { en: "Block Devices", ja: "ブロックデバイス", fr: "Périphériques", ru: "Блочные устройства" },
    "空间使用": { en: "Disk Usage", ja: "使用状況", fr: "Utilisation", ru: "Использование" },
    "设备": { en: "Device", ja: "デバイス", fr: "Périphérique", ru: "Устройство" },
    "文件系统": { en: "Filesystem", ja: "ファイルシステム", fr: "Système de fichiers", ru: "Файловая система" },
    "挂载点": { en: "Mount Point", ja: "マウント先", fr: "Point de montage", ru: "Точка монтирования" },
    "型号": { en: "Model", ja: "モデル", fr: "Modèle", ru: "Модель" },
    "监控告警": { en: "Monitoring Alerts", ja: "監視アラート", fr: "Alertes de surveillance", ru: "Оповещения мониторинга" },
    "启用阈值告警（CPU/内存/磁盘超限时推送 Webhook）": { en: "Enable threshold alerts (Webhook on CPU/memory/disk limit)", ja: "閾値アラートを有効化（CPU/メモリ/ディスク超過時にWebhook）", fr: "Activer les alertes de seuil (Webhook sur dépassement)", ru: "Включить оповещения (Webhook при превышении)" },
    "Webhook 地址": { en: "Webhook URL", ja: "Webhook URL", fr: "URL Webhook", ru: "URL Webhook" },
    "CPU 阈值 (%)": { en: "CPU threshold (%)", ja: "CPUしきい値 (%)", fr: "Seuil CPU (%)", ru: "Порог CPU (%)" },
    "内存阈值 (%)": { en: "Memory threshold (%)", ja: "メモリしきい値 (%)", fr: "Seuil mémoire (%)", ru: "Порог памяти (%)" },
    "磁盘阈值 (%)": { en: "Disk threshold (%)", ja: "ディスクしきい値 (%)", fr: "Seuil disque (%)", ru: "Порог диска (%)" },
    "告警冷却（分钟）": { en: "Alert cooldown (min)", ja: "アラート冷却（分）", fr: "Refroidissement (min)", ru: "Интервал (мин)" },
    "保存配置": { en: "Save Config", ja: "設定を保存", fr: "Enregistrer", ru: "Сохранить" },
    "发送测试消息": { en: "Send Test Message", ja: "テスト送信", fr: "Envoyer un test", ru: "Отправить тест" },
    /* 防火墙页 */
    "切换状态": { en: "Toggle", ja: "状態切替", fr: "Basculer", ru: "Переключить" },
    "添加规则": { en: "Add Rule", ja: "ルールを追加", fr: "Ajouter une règle", ru: "Добавить правило" },
    "防火墙规则": { en: "Firewall Rules", ja: "ファイアウォールルール", fr: "Règles du pare-feu", ru: "Правила брандмауэра" },
    "规则": { en: "Rule", ja: "ルール", fr: "Règle", ru: "Правило" },
    "动作": { en: "Action", ja: "アクション", fr: "Action", ru: "Действие" },
    "方向": { en: "Direction", ja: "方向", fr: "Direction", ru: "Направление" },
    "来源": { en: "Source", ja: "送信元", fr: "Source", ru: "Источник" },
    "UFW 应用配置": { en: "UFW App Profiles", ja: "UFWアプリ設定", fr: "Profils UFW", ru: "Профили UFW" },
    "一键安装": { en: "Install", ja: "ワンクリックインストール", fr: "Installer", ru: "Установить" },
    "启动": { en: "Start", ja: "開始", fr: "Démarrer", ru: "Запустить" },
    "重启": { en: "Restart", ja: "再起動", fr: "Redémarrer", ru: "Перезапустить" },
    "重载规则": { en: "Reload Rules", ja: "ルール再読込", fr: "Recharger", ru: "Перезагрузить" },
    "停止": { en: "Stop", ja: "停止", fr: "Arrêter", ru: "Остановить" },
    "Fail2ban 规则": { en: "Fail2ban Jails", ja: "Fail2banルール", fr: "Règles Fail2ban", ru: "Правила Fail2ban" },
    "当前失败": { en: "Failed now", ja: "現在の失敗", fr: "Échecs actuels", ru: "Текущие сбои" },
    "累计失败": { en: "Total failed", ja: "累計失敗", fr: "Échecs totaux", ru: "Всего сбоев" },
    "当前封禁": { en: "Banned now", ja: "現在の禁止", fr: "Bannis actuels", ru: "Сейчас заблокировано" },
    "累计封禁": { en: "Total banned", ja: "累計禁止", fr: "Bannis totaux", ru: "Всего блокировок" },
    "封禁 IP": { en: "Banned IPs", ja: "禁止IP", fr: "IP bannis", ru: "Заблокированные IP" },
    /* 模型页 */
    "安装 Ollama": { en: "Install Ollama", ja: "Ollamaをインストール", fr: "Installer Ollama", ru: "Установить Ollama" },
    "拉取模型": { en: "Pull Model", ja: "モデルを取得", fr: "Tirer un modèle", ru: "Загрузить модель" },
    "对话测试": { en: "Chat Test", ja: "対話テスト", fr: "Test de chat", ru: "Тест чата" },
    "GPU 监控": { en: "GPU Monitor", ja: "GPU監視", fr: "Surveillance GPU", ru: "Мониторинг GPU" },
    "本地模型": { en: "Local Models", ja: "ローカルモデル", fr: "Modèles locaux", ru: "Локальные модели" },
    "运行中": { en: "Running", ja: "実行中", fr: "En cours", ru: "Запущено" },
    "模型库": { en: "Catalog", ja: "モデルカタログ", fr: "Catalogue", ru: "Каталог" },
    /* 应用页 */
    "搜索应用名/类别/说明/指令": { en: "Search apps / category / description / command", ja: "アプリ名/カテゴリ/説明/コマンドで検索", fr: "Rechercher une application", ru: "Поиск приложений" },
    "检查更新": { en: "Check Updates", ja: "更新を確認", fr: "Vérifier les mises à jour", ru: "Проверить обновления" },
    "Docker 应用": { en: "Docker Apps", ja: "Dockerアプリ", fr: "Applications Docker", ru: "Приложения Docker" },
    "容器化安装 · 一键启停/日志/卸载": { en: "Containerized · one-click start/stop/logs/uninstall", ja: "コンテナ化 · ワンクリック操作", fr: "Conteneurisé · démarrage/arrêt/logs/désinstallation", ru: "В контейнерах · пуск/стоп/логи/удаление" },
    "应用商店": { en: "App Store", ja: "アプリストア", fr: "Magasin d'applications", ru: "Магазин приложений" },
    "分类": { en: "Category", ja: "カテゴリ", fr: "Catégorie", ru: "Категория" },
    "说明": { en: "Description", ja: "説明", fr: "Description", ru: "Описание" },
    "安装指令": { en: "Install Command", ja: "インストールコマンド", fr: "Commande d'installation", ru: "Команда установки" },
    /* 数据库页 */
    "新建数据库": { en: "New Database", ja: "新しいデータベース", fr: "Nouvelle base de données", ru: "Новая база данных" },
    "连接设置": { en: "Connection Settings", ja: "接続設定", fr: "Paramètres de connexion", ru: "Настройки подключения" },
    /* 网站页 */
    "新建站点": { en: "New Site", ja: "新しいサイト", fr: "Nouveau site", ru: "Новый сайт" },
    "Nginx 状态未知": { en: "Nginx status unknown", ja: "Nginxの状態不明", fr: "État Nginx inconnu", ru: "Статус Nginx неизвестен" },
    "安装 Nginx": { en: "Install Nginx", ja: "Nginxをインストール", fr: "Installer Nginx", ru: "Установить Nginx" },
    "站点列表": { en: "Site List", ja: "サイト一覧", fr: "Liste des sites", ru: "Список сайтов" },
    "站点名": { en: "Site Name", ja: "サイト名", fr: "Nom du site", ru: "Имя сайта" },
    "域名": { en: "Domain", ja: "ドメイン", fr: "Domaine", ru: "Домен" },
    "端口": { en: "Port", ja: "ポート", fr: "Port", ru: "Порт" },
    "目录/代理目标": { en: "Directory / Proxy Target", ja: "ディレクトリ/プロキシ先", fr: "Répertoire / Cible proxy", ru: "Каталог / Цель прокси" },
    /* 终端页 */
    "新建会话": { en: "New Session", ja: "新しいセッション", fr: "Nouvelle session", ru: "Новая сессия" },
    "断开": { en: "Disconnect", ja: "切断", fr: "Déconnecter", ru: "Отключить" },
    "全屏": { en: "Fullscreen", ja: "全画面", fr: "Plein écran", ru: "Во весь экран" },
    "未连接": { en: "Not connected", ja: "未接続", fr: "Non connecté", ru: "Не подключено" },
    /* 命令页 */
    "命令执行": { en: "Command Execution", ja: "コマンド実行", fr: "Exécution de commande", ru: "Выполнение команд" },
    "未开启": { en: "Disabled", ja: "無効", fr: "Désactivé", ru: "Отключено" },
    "以当前用户身份执行命令，每次执行需本机密码验证，超时 30 秒。": { en: "Run commands as the current user. Each execution requires local password verification, 30s timeout.", ja: "現在のユーザーでコマンドを実行。毎回パスワード認証が必要、タイムアウト30秒。", fr: "Exécute en tant qu'utilisateur actuel. Vérification du mot de passe à chaque fois, délai 30 s.", ru: "Выполнение от текущего пользователя. Требуется проверка пароля, таймаут 30 сек." },
    "快捷命令": { en: "Quick Commands", ja: "クイックコマンド", fr: "Commandes rapides", ru: "Быстрые команды" },
    "例如：uptime; df -h": { en: "e.g. uptime; df -h", ja: "例：uptime; df -h", fr: "ex. uptime; df -h", ru: "напр.: uptime; df -h" },
    "执行": { en: "Run", ja: "実行", fr: "Exécuter", ru: "Выполнить" },
    "等待执行...": { en: "Waiting to run...", ja: "実行待ち...", fr: "En attente...", ru: "Ожидание..." },
    /* 常用状态 / 按钮 */
    "运行中": { en: "Running", ja: "実行中", fr: "En cours", ru: "Запущено" },
    "已停止": { en: "Stopped", ja: "停止済み", fr: "Arrêté", ru: "Остановлено" },
    "正常": { en: "OK", ja: "正常", fr: "Normal", ru: "Нормально" },
    "异常": { en: "Abnormal", ja: "異常", fr: "Anormal", ru: "Ненормально" },
    "启用": { en: "Enable", ja: "有効", fr: "Activer", ru: "Включить" },
    "停用": { en: "Disable", ja: "無効", fr: "Désactiver", ru: "Отключить" },
    "删除": { en: "Delete", ja: "削除", fr: "Supprimer", ru: "Удалить" },
    "编辑": { en: "Edit", ja: "編集", fr: "Modifier", ru: "Изменить" },
    "添加": { en: "Add", ja: "追加", fr: "Ajouter", ru: "Добавить" },
    "新建": { en: "New", ja: "新規", fr: "Nouveau", ru: "Новый" },
    "确认": { en: "Confirm", ja: "確認", fr: "Confirmer", ru: "Подтвердить" },
    "取消": { en: "Cancel", ja: "キャンセル", fr: "Annuler", ru: "Отмена" },
    "下载": { en: "Download", ja: "ダウンロード", fr: "Télécharger", ru: "Скачать" },
    "在线": { en: "Online", ja: "オンライン", fr: "En ligne", ru: "В сети" },
    "离线": { en: "Offline", ja: "オフライン", fr: "Hors ligne", ru: "Не в сети" },
    "未知": { en: "Unknown", ja: "不明", fr: "Inconnu", ru: "Неизвестно" },
    "已连接": { en: "Connected", ja: "接続済み", fr: "Connecté", ru: "Подключено" },
    "等待": { en: "Waiting", ja: "待機中", fr: "En attente", ru: "Ожидание" },
    "完成": { en: "Done", ja: "完了", fr: "Terminé", ru: "Готово" },
    "失败": { en: "Failed", ja: "失敗", fr: "Échec", ru: "Ошибка" },
    "成功": { en: "Success", ja: "成功", fr: "Succès", ru: "Успех" },
    "安装": { en: "Install", ja: "インストール", fr: "Installer", ru: "Установить" },
    "卸载": { en: "Uninstall", ja: "アンインストール", fr: "Désinstaller", ru: "Удалить" },
    "升级": { en: "Upgrade", ja: "アップグレード", fr: "Mettre à niveau", ru: "Обновить" },
    "开始": { en: "Start", ja: "開始", fr: "Démarrer", ru: "Начать" },
    "暂停": { en: "Pause", ja: "一時停止", fr: "Pause", ru: "Пауза" },
    "继续": { en: "Resume", ja: "再開", fr: "Reprendre", ru: "Продолжить" },
    "搜索": { en: "Search", ja: "検索", fr: "Rechercher", ru: "Поиск" },
    "复制": { en: "Copy", ja: "コピー", fr: "Copier", ru: "Копировать" },
    "返回": { en: "Back", ja: "戻る", fr: "Retour", ru: "Назад" },
    "关闭": { en: "Close", ja: "閉じる", fr: "Fermer", ru: "Закрыть" },
    "保存更改": { en: "Save Changes", ja: "変更を保存", fr: "Enregistrer", ru: "Сохранить" },
    "重试": { en: "Retry", ja: "再試行", fr: "Réessayer", ru: "Повторить" },
    "跳过": { en: "Skip", ja: "スキップ", fr: "Ignorer", ru: "Пропустить" },
    "管理": { en: "Manage", ja: "管理", fr: "Gérer", ru: "Управлять" },
    "查看": { en: "View", ja: "表示", fr: "Voir", ru: "Просмотр" },
    "更多": { en: "More", ja: "もっと", fr: "Plus", ru: "Ещё" },
    "全部": { en: "All", ja: "すべて", fr: "Tout", ru: "Все" },
    "默认": { en: "Default", ja: "デフォルト", fr: "Par défaut", ru: "По умолчанию" },
    "自定义": { en: "Custom", ja: "カスタム", fr: "Personnalisé", ru: "Свой" },
    "启用中": { en: "Enabled", ja: "有効中", fr: "Activé", ru: "Включено" },
    "已禁用": { en: "Disabled", ja: "無効中", fr: "Désactivé", ru: "Отключено" },
    "无数据": { en: "No data", ja: "データなし", fr: "Aucune donnée", ru: "Нет данных" }
  };

  /* ---------- 核心逻辑 ---------- */
  var STORAGE_KEY = "panel_lang";
  var currentLang = "zh-CN";

  function getStoredLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v) return v;
    } catch (e) { /* ignore */ }
    return "zh-CN";
  }

  function isKnownLang(code) {
    for (var i = 0; i < I18N_LANGS.length; i++) {
      if (I18N_LANGS[i][0] === code) return true;
    }
    return false;
  }

  /* 翻译查询：字典命中 -> 当前语言，缺则回退中文原文 */
  function t(zh) {
    if (!zh) return zh;
    var entry = I18N_DICT[zh];
    if (!entry) return zh;
    if (currentLang === "zh-CN") return zh;
    if (entry[currentLang]) return entry[currentLang];
    if (currentLang === "zh-TW") return zh; /* 繁体暂用简体 */
    if (entry.en) return entry.en; /* 未翻译语言回退英文 */
    return zh;
  }

  /* 文本节点翻译（跳过脚本/样式/代码/终端） */
  function translateTextNode(node) {
    var zh = node.data;
    if (!zh || !zh.trim()) return;
    var parent = node.parentElement;
    if (!parent) return;
    if (parent.closest("script,style,pre,code,textarea,#terminalHost,xmp")) return;
    var tr = t(zh);
    if (tr !== zh) node.data = tr;
  }

  function translateAttributes(el) {
    if (!el.attributes) return;
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name === "placeholder" || attr.name === "title" || attr.name === "aria-label") {
        var tr = t(attr.value);
        if (tr !== attr.value) attr.value = tr;
      }
    }
  }

  /* 遍历并翻译（静态 + 动态） */
  function translateTree(root) {
    root = root || document.body;
    /* 属性 */
    if (root.nodeType === 1) translateAttributes(root);
    var all = root.querySelectorAll ? root.querySelectorAll("*") : [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest("script,style,pre,code,textarea,#terminalHost,xmp")) continue;
      translateAttributes(el);
      var child = el.firstChild;
      while (child) {
        if (child.nodeType === 3) translateTextNode(child);
        child = child.nextSibling;
      }
    }
  }

  /* 防重复：记录已翻译的元素，避免 MutationObserver 反复处理 */
  var observer = null;
  function ensureObserver() {
    if (observer) return;
    observer = new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var mu = mutations[m];
        if (mu.type === "attributes") {
          translateAttributes(mu.target);
        } else if (mu.type === "characterData") {
          translateTextNode(mu.target);
        } else if (mu.addedNodes && mu.addedNodes.length) {
          for (var n = 0; n < mu.addedNodes.length; n++) {
            var node = mu.addedNodes[n];
            if (node.nodeType === 1) {
              if (node.closest("script,style,pre,code,textarea,#terminalHost,xmp")) continue;
              translateTree(node);
            } else if (node.nodeType === 3) {
              translateTextNode(node);
            }
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
    });
  }

  /* 语言选择器 */
  function buildSelector() {
    var select = document.getElementById("langSelect");
    if (!select) return;
    select.innerHTML = "";
    for (var i = 0; i < I18N_LANGS.length; i++) {
      var opt = document.createElement("option");
      opt.value = I18N_LANGS[i][0];
      opt.textContent = I18N_LANGS[i][1];
      select.appendChild(opt);
    }
    select.value = currentLang;
    select.addEventListener("change", function () {
      setLang(select.value);
    });
  }

  function setLang(code) {
    if (!isKnownLang(code)) code = "zh-CN";
    currentLang = code;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) { /* ignore */ }
    document.documentElement.lang = code;
    translateTree(document.body);
    var select = document.getElementById("langSelect");
    if (select) select.value = code;
  }

  function initI18N() {
    currentLang = getStoredLang();
    if (!isKnownLang(currentLang)) currentLang = "zh-CN";
    document.documentElement.lang = currentLang;
    buildSelector();
    translateTree(document.body);
    ensureObserver();
    /* 响应主题/语言选择器的语言标签 */
    translateTree(document.querySelector(".topbar-actions"));
  }

  window.I18N = {
    langs: I18N_LANGS,
    dict: I18N_DICT,
    t: t,
    setLang: setLang,
    getLang: function () { return currentLang; }
  };

  /* 等待 DOM 就绪后初始化 */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initI18N);
  } else {
    initI18N();
  }
})();
