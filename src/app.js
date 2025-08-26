const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./backend/routes/index');
const userRouters = require('./backend/routes/userRouters');
const partialRouter = express.Router();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use('/css', express.static(path.join(__dirname, 'frontend/css')));
app.set('views', path.join(__dirname, 'frontend/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'frontend/public')));
app.use(express.static(path.join(__dirname, 'backend/public')));

app.get("/cadastro", (req, res) => { res.render("cadastro"); });
app.get("/login", (req, res) => { res.render("login"); });
app.get("/home", (req, res) => { res.render("home"); });

partialRouter.get("/perfil", (req, res) => { res.render("partials/perfil"); });
partialRouter.get("/loja", (req, res) => { res.render("partials/loja"); });
partialRouter.get("/config", (req, res) => { res.render("partials/config"); });

// Rotas
app.use('/', indexRouter);
app.use('/api/users', userRouters); // GET /api/users/ → lista usuários
app.use('/', partialRouter);

// Catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

module.exports = app;
