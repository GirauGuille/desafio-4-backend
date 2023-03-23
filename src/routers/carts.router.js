import { Router } from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const productManager = new ProductManager("src/db/products.json");
const cartManager = new CartManager("src/db/carts.json");
const notFound = { error: "Cart not found" };

router.post("/", async (req, res) => {
  await cartManager.createCart();
  res.status(201).json({ mensaje: "Carrito creado con exito" });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getById(parseInt(cid));
  !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const product = await productManager.getById(parseInt(pid));
  if (product) {
    const cart = await cartManager.addToCart(parseInt(cid), parseInt(pid));
    !cart ? res.status(404).json(notFound) : res.status(200).json(cart);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

export default router;
