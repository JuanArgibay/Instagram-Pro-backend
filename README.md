# InstagramPro

App inspirada en Instagram.

Implementar una API que permita publicar fotos (añadiendo o no textos) y
que otras personas puedan verlas.

## Dependencias

### Dependencias de produccion

-   express
-   express-fileupload
-   dotenv
-   mysql2
-   cors
-   bcrypt
-   jsonwebtoken
-   @sendgrid/mail
-   morgan
-   sharp
-   uuid
-   joi

### Dependencias de desarrollo

-   eslint
-   nodemon
-   prettier

## ENDPOINTS

### Endpoint de usuarios

-   Ver el perfil de un usuario y su galeria de fotos.

```js
app.get('/users/:idUser', getUser);
```

-   Registro. - Extra: Validación por email.

```js
app.post('/users', newUser);
```

-   Validar un usuario

```js
app.get('/users/validate/:registrationCode', validateUser);
```

-   Devuelve los datos del usuario logeado y sus fotos

```js
app.get('/users', authUserOptional, getOwnUser);
```

-   Login

```js
app.post('/users/login', loginUser);
```

-   Editar usuario **TOKEN && ACTIVE**

```js
app.put('/users', authUser, editUser);
```

&nbsp;

### Endpoints entries

-   Publicar una foto (con resize) con una descripcion **TOKEN && ACTIVE**

```js
app.post('/entries', authUser, newEntry);
```

-   Ver ultimas fotos (entries) publicadas por otros usuarios. // Buscar fotos por texto descriptivo.

```js
app.get('/entries', authUserOptional, listEntries);
```

-   Obtener datos de una entrada en particular

```js
app.get('/entries/:idEntry', authUserOptional, getSingleEntry);
```

-   Ver los comentarios de una entrada

```js
app.get('/entries/:idEntry/comment', authUserOptional, viewEntryComments);
```

-   Comentar una foto. **TOKEN && ACTIVE**

```js
app.post('/entries/:idEntry/comment', authUser, insertCommentToEntry);
```

-   Dar / Quitar like a una foto . **TOKEN && ACTIVE**

```js
app.post('/entries/:idEntry/like', authUser, likeEntry);
```

-   Obtener las fotos (Galería) del propio usuario

```js
app.get('/entries/users', authUser, getOwnPhotos);
```

&nbsp;

## Iniciar la aplicación

1. Crear la BBDD en MySQL
2. Cumplimentar los datos '_.env_' siguiendo como ejemplo el fichero '_.env.example_'

    - PORT: Puerto sobre el que operarán las peticiones a nuestro server
    - MYSQL_HOST: La URL que hosteara nuestro server
    - MYSQL_USER: Usuario de MySQL donde tengamos nuestra BBDD
    - MYSQL_PASS: Contraseña de MySQL
    - MYSQL_DB: Nombre de nuestra BBDD
    - SECRET: Codigo aleatorio para encriptar el token
    - UPLOADS_DIR: Directorio donde se almacenaran las imagenes
    - SENDGRID_API_KEY: Key de la dependencia que validara a los usuarios mediante email
    - SENDGRID_FROM: El email desde donde se mandara dicha validación

### Inicializar Base de Datos

```bash
npm run db
```

Ejecutamos mediante el comando indicado anteriormente el fichero _'./db/initDB'_ para inicializar la BBDD las tablas requeridas.

### Lanzamos el Servidor

```bash
npm run dev
```

Ejecutamos mediante el comando indicado anteriormente el fichero _'./server.js'_ para lanzar el servidor.

&nbsp;

Una vez tengamos el server a la escucha de peticiones podemos realizar llamadas mediante los endpoints indicados anteriormente.

&nbsp;

## Estructura de ficheros

### Controladores

Se encuentran todos los ficheros encargados de manejar las peticiones; donde se encuentran a su vez diferenciadas en:

-   Controladores de usuarios _'users'_
-   Controladores de entradas _'entries'_

### Queries

Las queries se encuentran alojadas dentro de la carpeta de la BBDD, donde tambien tenemos _'initDB'_ y _'getConnection'_. Las queries se encuentras a su vez diferenciadas en:

-   Queries de usuarios _'userQueries'_
-   Queries de entradas _'entriesQueries'_

### Schemes

Se encuentran los esquemas de validacion requeridos sobre los datos que nos llegan desde el cliente.

### Middlewares

Middlewares creados por nosotros para darle utilidad global a la aplicacion. Ej.: Autenticación del usuario.

### Helpers.js

Se encuentran determinadas funciones auxiliares.
