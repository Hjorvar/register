const express = require('express');
const app = express();
const indexRoutes = require('./src/routes');
const usersRoutes = require('./src/routes/users');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', './src/views'); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use('/', indexRoutes);
app.use('/users', usersRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
