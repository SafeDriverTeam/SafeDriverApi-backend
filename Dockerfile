# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos necesarios para la aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código de la API al contenedor
COPY . .

# Expone el puerto en el que la API funciona
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
