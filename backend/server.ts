import app from './app';
import dotenv from 'dotenv';

// cargar variables de entorno desde el archivo .env
dotenv.config();

// por defecto, hasta poner el .env xd
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    //rreservado para inicializaciones futuras de la base de datos
    //ejm: await conectarBaseDatos() etcetc;
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Entorno actual de desarrollo activo`);
    });
  } catch (error) {
    console.error("Error crítico al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Ejecutar el inicio del servidor
startServer();