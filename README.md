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

##Файлы
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

app/models                          - модели

app/public                          - public
app/public/index.html               - точка входа клиента
app/public/index.production.html    - точка входа клиента для production
app/public/css                      - css
app/public/js                       - js для development
app/public/compiled-js              - css для production

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


##Маршруты
GET /                           - точка входа в приложение
GET /static/css                 - css files
GET /static/js                  - js files

GET /films/:id                  - информация про фильм с указаным айди
Answer:
    Success:
```js
        {
            status:'success',
            data:{
                name:FILM_NAME,
                format:FILM_FORMAT,
                realized_at:FILM_REALIZED_AT,
                actors:[ACTOR, ACTOR,....]
            }
        }
```
        
GET /films                       - загрузить список фильмов
GET-params:
    query           - строка поиска
    queryTatrget    - 'name'|'actors'. Ищет вхождение среди акутеров или имен фильмов.
Answer:
    Success:
```js
        {
            status:'success',
            data:[
            {
                name:FILM_NAME,
                format:FILM_FORMAT,
                realized_at:FILM_REALIZED_AT,
                actors:[ACTOR, ACTOR,....]
            }
            ,...]
        }
```

POST /films                       - добавить фильмы в БД
POST-params:
    *name            - название фильма
    *format          - формат
    *actors          - актеры через запятую
    *realized_at     - год выпуска
Answer:
    Success: вернет информацию об созданом обьекте
```js
        {
            status:'success',
            data:{
                 name:FILM_NAME,
                 format:FILM_FORMAT,
                 realized_at:FILM_REALIZED_AT,
                 actors:[ACTOR, ACTOR,....]
             }
        }
```

POST /films                       - добавить фильмы в БД
POST-params:
    *films            - файл с фильмамы
Answer:
    Success: вернет информацию об успешно созданых обьектах
```js
        {
            status:'success',
            data:[{
                 name:FILM_NAME,
                 format:FILM_FORMAT,
                 realized_at:FILM_REALIZED_AT,
                 actors:[ACTOR, ACTOR,....]
             }
             ,...]
        }
```

PUT /films/:id                 - изменить информацию о фильме
PUT-params:
    name            - название фильма
    format          - формат
    actors          - актеры через запятую
    realized_at     - год выпуска
Answer:
    Success: вернет новую информацию об обьекте
```js
        {
            status:'success',
            data:{
                 name:FILM_NAME,
                 format:FILM_FORMAT,
                 realized_at:FILM_REALIZED_AT,
                 actors:[ACTOR, ACTOR,....]
             }
        }
```

DELETE /films/:id               - удаляет фильм из БД
Answer:
    Success: вернет информацию об удаленном обьекте обьекте
```js
        {
            status:'success',
            data:{
                 name:FILM_NAME,
                 format:FILM_FORMAT,
                 realized_at:FILM_REALIZED_AT,
                 actors:[ACTOR, ACTOR,....]
             }
        }
```

При неуспешном запросе ответ будет:
```js
        {
            status:'error',
            message:MESSAGE
        }
```



        
#Тесты

```bash
Windows:
set NODE_ENV=testing&&npm test
Ubuntu/Mac:
export NODE_ENV=testing&&npm test
```
