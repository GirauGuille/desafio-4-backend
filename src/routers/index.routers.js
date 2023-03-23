import { Router } from "express";
import products from "./products.router.js";
import carts from "./carts.router.js";
import views from "./viewsRouter/views.router.js";

const router = Router();

router.use("/products", products);
router.use("/carts", carts);
router.use("/", views);

export default router;
