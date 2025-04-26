import express from 'express';
import path from 'path';

// __dirname ya está disponible en CommonJS
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.get('/inicio_sesion', (req, res) => {
    res.render('inicio_sesion');
});

app.get('/instrumentos', (req, res) => {
    res.render('instrumentos');
});

app.get('/pedir', (req, res) => {
    res.render('pedir');
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});