import {Router} from "express";
import * as clienteController from "../controllers/clienteController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get("/cliente", authMiddleware, clienteController.getAllClientes);
router.post("/cliente/signin", clienteController.registerCliente);
router.post("/cliente/login", clienteController.loginCliente);
router.get("/cliente/:id", authMiddleware, clienteController.getCliente);
router.put("/cliente/:id", authMiddleware, clienteController.updateCliente);
router.delete("/cliente/:id", authMiddleware, clienteController.deleteCliente);

export default router;
