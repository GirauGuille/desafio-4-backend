import express, { json } from "express";
import routers from "./src/routers/index.routers.js";
import { __dirname } from "./src/utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./src/controllers/productManager.js";
const productManager = new ProductManager("src/db/products.json");

const app = express();
const PORT = 8080;

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/* handlebars */
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

/* routers */
app.use("/", routers);
app.use("/api", routers);

/* server */
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`);
  console.log(`http://localhost:${PORT}`);
});
httpServer.on("error", error =>
  console.log(`Error en servidor: ${error.message}`)
);

/* webSocket */
const socketServer = new Server(httpServer);
socketServer.on("connection", async socket => {
  const products = await productManager.getAll();
  socket.emit("products", products);

  socket.on("newProduct", async data => {
    await productManager.addProduct(data);
    socket.emit("products", products);
  });

  socket.on("deleteProduct", async id => {
    const products = await productManager.deleteById(id);
    socket.emit("products", products);
  });
});
