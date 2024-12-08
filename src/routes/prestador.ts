import {Router} from "express";
import * as prestadorController from "../controllers/prestadorController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get("/prestador", prestadorController.getAllPrestadores);
router.get("/prestador/:id", prestadorController.getPrestador);
router.post("/prestador/signin", prestadorController.createPrestador);
router.put("/prestador/:id", authMiddleware, prestadorController.updatePrestador);
router.delete("/prestador/:id", authMiddleware, prestadorController.deletePrestador);
router.post("/prestador/login", prestadorController.loginPrestador);

export default router;
