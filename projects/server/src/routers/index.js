const express = require("express");
const userRouter = require("./user");
const productRouter = require("./product");
const TransactionRouter = require("./transaction");
const warehouseRouter = require("./warehouse");
const rajaOngkirRouter = require("./rajaongkir");
const cartRouter = require("./cart");
const addressRouter = require("./address");

const router = express.Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/trans", TransactionRouter);
router.use("/warehouse", warehouseRouter);
router.use("/rajaongkir", rajaOngkirRouter);
router.use("/cart", cartRouter);
router.use("/address", addressRouter);

module.exports = router;
