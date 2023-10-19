# Chat Basico

Turso como base de datos MySql Lite [Más Info](https://turso.tech/)

Socket.io como libreria de Web Socket [Más Info](https://socket.io/) o por [NPM](https://www.npmjs.com/package/socket.io)

> Para las variables de entorno se debe configurar en local la CLI de TURSO

[Instalación](https://docs.turso.tech/tutorials/get-started-turso-cli/step-01-installation)

```
 brew install tursodatabase/tap/turso
```

> Logearse desde la consola

````
turso auth login
````

> Crear un base de datos

````
 turso db create
````
> Interactuar con una Shell SQL
```
   turso db shell [nombre-db]
```

> Obtener información de conexión a la base de datos
```
   turso db show [nombre-db]
```


> Obtener un token de acceso para la conexión con la base de datos

```
   turso db tokens create [nombre-db]
```

Duplicar el archivo __.env.template__ y renombrar a __.env__

**Con la url de conexión y el token debe llenar las variables del archivo .env**