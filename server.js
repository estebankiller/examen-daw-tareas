const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const data = require('./data'); // Importamos el archivo del profesor

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares para procesar formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- RUTAS DE VISTAS ---

// Ruta 1: Inicio (Todas las tareas)
app.get('/', (req, res) => {
    const categorias = data.getCategorias();
    const proximas = data.getTareasHoyYFuturo();
    const vencidas = data.getTareasVencidas();
    
    res.render('home', { categorias, proximas, vencidas, categoriaActual: 'All' });
});

// Ruta 2: Categorías
app.get('/category/:name', (req, res) => {
    const nombreCategoria = req.params.name;
    const categorias = data.getCategorias();
    const filtradas = data.getTareasPorCategoria(nombreCategoria);
    
    res.render('category', { 
        categorias, 
        categoriaActual: nombreCategoria, 
        proximas: filtradas.hoyYFuturo, 
        vencidas: filtradas.vencidas 
    });
});

// Ruta 3: Detalle de tarea
app.get('/task/:id', (req, res) => {
    const categorias = data.getCategorias();
    const tarea = data.getTareaById(req.params.id);
    
    if (!tarea) {
        return res.status(404).send('Tarea no encontrada');
    }
    
    res.render('detalle', { categorias, tarea, categoriaActual: '' });
});

// --- RUTA DE LOGIN (Para el LocalStorage y el Modal) ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const resultado = data.validateLogin(email, password);
    
    if (resultado.ok) {
        res.json({ success: true, user: resultado.user });
    } else {
        res.status(401).json({ success: false, error: resultado.error });
    }
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`);
});