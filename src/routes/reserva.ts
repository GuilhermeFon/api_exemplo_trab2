import {Router} from "express";
import * as reservaController from "../controllers/reservaController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, reservaController.createReserva);
router.get("/", authMiddleware, reservaController.getAllReservas);
router.get("/prestador/:prestadorId", authMiddleware, reservaController.getReserva);
router.get("/cliente/:clienteId", authMiddleware, reservaController.getReserva);
router.put("/:id", authMiddleware, reservaController.updateReserva);
router.delete("/:id", authMiddleware, reservaController.deleteReserva);

export default router;
