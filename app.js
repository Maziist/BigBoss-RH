const express = require('express');
const companyRouter = require('./router/companyRouter');
const employeRouter = require('./router/employeRouter');
const { scheduleTaskUpdates } = require('./services/scheduledTasks');
const session = require('express-session');
const path = require('path');
const app = express();


require('dotenv').config();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configuration des routes
app.use(companyRouter);
app.use(employeRouter);

// Démarrer le planificateur de tâches
scheduleTaskUpdates();

 app.listen(process.env.PORT, () => {
    console.log('Connecté sur le port 3000'); 
});
