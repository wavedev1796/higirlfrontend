import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

// Middlewares globales fundamentales
app.use(cors());
app.use(express.json()); // Permite procesar cuerpos en formato JSON
app.use(express.urlencoded({ extended: true }));

// Ruta base de prueba para verificar el estado de la API
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'API Gateway operativo' 
  });
});

//aquí se importarán e integrarán las rutas de las capas posteriores más adelante
//ejm: app.use('/api/users', userRoutes);

export default app;