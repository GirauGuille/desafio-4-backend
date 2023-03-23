import { Router } from "express";
import ProductManager from "../../controllers/productManager.js";

const router = Router();
const productManager = new ProductManager("src/db/products.json");

//home
router.get("/", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", {
    style: "home.css",
    title: "Home",
    products: products,
  });
});

//RealTimeProducts
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
  res.render("realTimeProducts", {
    style: "realTimeProducts.css",
    title: "Real Time Products",
    products: products,
  });
});

export default router;
