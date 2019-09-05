#Установка
1.
```bash
git clone git@github.com:Nafaya/wlfilms.git
cd wlfilms
npm install
```
2.
Настройка базы
1). В app/config/database.json находятся найстроки доступа к БД

2). В data находится дамп структуры базы.
```bash
npm run make_db
```

##Запуск
```bash
npm start
```
##Продакшин
Сборка
```bash
npm run build
```
Запуск
```bash
Windows:
set NODE_ENV=production&&npm start
Ubuntu/Mac:
export NODE_ENV=testing&&npm test
```

#Архитектура
index.js                        - стартовая точка приложения
app/                            - папка проекта
app/config/                     - конфиги проекта
app/config/server.json          - файл конфига сервера
app/config/database.json        - файл конфига БД
app/config/app.json             - файл конфига приложения
app/config/environment.js       - настройка окружения для express-сервера
app/config/routes.js            - настройка марщрутов для express-сервера
app/config/index.js             - хелпер для загрузки конфигов

app/controllers                 - контроллеры.
app/dbmodels                    - орм-модели БД.
app/models                      - модели
app/views                       - views
app/views/db_view.js            - хелпер для форматирования моделей из БД перед отправкой пользователю

data/                           - любые данные касающиеся приложения
data/sample_movies.txt          - пример файла для загрузки на странице
data/wlfilms.sql                - дамп структуры бд

scripts/                        - скрипты
scripts/make_db.js              - импорт структуры БД
scripts/prestart.js             - скрипт перед запуском приложения(проверяет все ли  папки создались)

/temp                           - temp folder

/test                           - тестовые скрипты

#Тесты

```bash
Windows:
set NODE_ENV=testing&&npm test
Ubuntu/Mac:
export NODE_ENV=testing&&npm test
```
