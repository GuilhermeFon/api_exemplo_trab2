import {Router} from "express";
import * as clienteController from "../controllers/clienteController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, clienteController.getAllClientes);
router.post("/signin", clienteController.registerCliente);
router.post("/login", clienteController.loginCliente);
router.get("/:id", authMiddleware, clienteController.getCliente);
router.put("/:id", authMiddleware, clienteController.updateCliente);
router.delete("/:id", authMiddleware, clienteController.deleteCliente);

export default router;
