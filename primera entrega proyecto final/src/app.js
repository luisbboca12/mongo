const express = require('express');
const {Server}= require('socket.io');
const exphbs = require('express-handlebars').create;
const path = require('path');

///importaciones
const { productRouter, productManager } = require('./rutas/products');
const {cartsRouter} = require('./rutas/carts');
const Cart = require('./dao/models/cartModel');
const Message = require('./dao/models/messageModel');
const Product = require('./dao/models/productModel');

// Importar managers de FileSystem
const { cartManager, messageManager, productManager } = require('./dao/fsManagers');

// Importar managers de MongoDB
const { cartDbManager, messageDbManager, productDbManager } = require('./dao/dbManagers');
const PORT = process.env.PORT || 3000;
const app = express();
////////////
const mongoose = require('mongoose');


// Configura la conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://luib1218:<PASSWORD>@cluster0.yvghbq2.mongodb.net/<DATABASE> ', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB Atlas');
});
// Define el esquema del modelo de productos
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  thumbnail: String
});

// Crea el modelo de productos
const Product = mongoose.model('Product', productSchema);

// Ejemplo de creación de un nuevo producto
const nuevoProducto = new Product({
  title: 'Nuevo Producto',
  price: 99.99,
  thumbnail: 'someUrl.com'
});

// Guarda el producto en la base de datos
nuevoProducto.save((error, productoGuardado) => {
  if (error) {
    console.error('Error al guardar el producto:', error);
  } else {
    console.log('Producto guardado exitosamente:', productoGuardado);
  }
});

// Consulta todos los productos en la base de datos
Product.find({}, (error, productos) => {
  if (error) {
    console.error('Error al consultar productos:', error);
  } else {
    console.log('Lista de productos:', productos);
  }
});



/// Inciar servidor
const serverExpress = app.listen(PORT, () => {console.log(`Servidor Express iniciado en http://localhost:${PORT}`)});
const io = new Server(serverExpress)

// Configuración de Handlebars
app.engine('.handlebars', exphbs({ extname: '.handlebars' }).engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
///Rutas de mongo
app.use('/api/carts', cartsRouter(cartDbManager));
app.use('/api/messages', messagesRouter(messageDbManager));
app.use('/api/products', productsRouter(productDbManager));
 
// Ruta para la vista index.handlebars
app.get('/', (req, res) => {
  const allProducts = productManager.getAllProducts();
  res.render('index', { products: allProducts });
});

// Ruta para la vista en tiempo real con websockets
app.get('/realtimeproducts', (req, res) => {
  const allProducts = productManager.getAllProducts();
  res.render('realTimeProducts', { products: allProducts });
});

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  //npm install -g nodemon
  socket.emit('actualizarProductos',productManager.getAllProducts())

  // Escucha eventos desde el cliente para agregar un nuevo producto
  socket.on('productoNuevo', (nuevoProducto) => {
    
    const nuevoProductoId = productManager.addProduct(nuevoProducto);
    console.log(`Nuevo producto agregado con ID: ${nuevoProductoId}`);

  
    io.emit('actualizarProductos', productManager.getAllProducts());
  });

  // Escucha eventos desde el cliente para eliminar un producto
  socket.on('productoEliminado', (productId) => {
   
    productManager.removeProduct(productId);

    // Actualiza la lista de productos 
    io.emit('actualizarProductos', productManager.getAllProducts());
  });

  // Maneja la desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});