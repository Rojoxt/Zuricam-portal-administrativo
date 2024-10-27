# Zuricam: Sistema de Monitoreo en Tiempo Real

## Descripción del Proyecto

**Zuricam** es un sistema de monitoreo basado en *Deep Learning* diseñado para la detección de asaltos armados en tiempo real. Este software proporciona una solución innovadora y eficaz para mejorar la seguridad pública mediante el uso de tecnologías avanzadas de visión por computadora.

Este proyecto incluye un portal administrativo que permite la creación de usuarios y la gestión de permisos, así como la funcionalidad para exportar reportes de manera eficiente. Es un trabajo realizado como parte de la tesis de los estudiantes de la Universidad Peruana de Ciencias Aplicadas (UPC) en la carrera de Ingeniería de Software.

## Autores

- **Máximo Mallqui**  
  Correo: [u201416643@upc.edu.pe](mailto:u201416643@upc.edu.pe)

- **De La Mar Zurita**  
  Correo: [u201521128@upc.edu.pe](mailto:u201521128@upc.edu.pe)

## Objetivos

### Objetivo General

Desarrollar un sistema de monitoreo en tiempo real que utilice *Deep Learning* para detectar asaltos armados y proporcionar una interfaz administrativa para la gestión de usuarios y reportes.

### Objetivos Específicos

1. Implementar un modelo de *Deep Learning* para la detección de armas en imágenes de video.
2. Crear un portal administrativo donde se puedan gestionar usuarios y permisos.
3. Desarrollar funcionalidades para la generación y exportación de reportes de incidentes.
4. Proporcionar una interfaz de usuario intuitiva y fácil de usar.

## Tecnologías Utilizadas

- **Lenguajes de Programación**: Python, JavaScript
- **Frameworks**:
    - FastAPI (backend)
    - Vue.js (frontend)
    - Vuetify (componentes UI)
- **Bibliotecas de Deep Learning**: YOLOv8
- **Base de Datos**: PostgreSQL
- **Otros**: Docker, Vercel (despliegue)

## Instalación

### Requisitos Previos

Asegúrate de tener instalados los siguientes elementos antes de comenzar:

- [Node.js](https://nodejs.org/) (versión recomendada: 14 o superior)
- [Python](https://www.python.org/downloads/) (versión recomendada: 3.7 o superior)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/get-started)

### Clonación del Repositorio

```bash
git clone https://github.com/tu_usuario/zuricam.git
cd zuricam
```

### Instalación del Backend

```bash
cd backend
pip install -r requirements.txt
```

### Instalación del Frontend

```bash
cd frontend
npm install
```

### Configuración de la Base de Datos
1. Crea una base de datos en PostgreSQL.
2. Configura las variables de entorno en el archivo .env según tus credenciales.

## Ejecución del Proyecto

### Frontend

```bash
cd frontend
npm run serve
```

## Uso

1. Accede al portal administrativo a través de  http://localhost:5173/ (o el puerto que hayas configurado).
2. Registra nuevos usuarios y asigna permisos.
3. Utiliza la función de detección en tiempo real para monitorizar posibles asaltos armados.
4. Genera y exporta reportes de incidentes en formatos compatibles.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar en este proyecto, por favor sigue los siguientes pasos:

1. Realiza un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
3. Realiza tus cambios y haz un commit (git commit -m 'Añadir nueva característica').
4. Envía un push a la rama (git push origin feature/nueva-caracteristica).
5. Abre un Pull Request.

### Licencia

Este proyecto está bajo la MIT License.

## Contacto
Para más información o preguntas, puedes contactar a los autores a través de sus correos electrónicos.
