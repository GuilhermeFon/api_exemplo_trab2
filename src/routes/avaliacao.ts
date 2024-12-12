import {Router} from "express";
import * as avaliacaoController from "../controllers/avaliacaoController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/:prestadorId",
  authMiddleware,
  avaliacaoController.createAvaliacao
);
router.post("/:clienteId", authMiddleware, avaliacaoController.createAvaliacao);
router.get("/:prestadorId", avaliacaoController.getAvaliacao);
router.get("/:clienteId", avaliacaoController.getAvaliacao);
router.get("/:prestadorId", avaliacaoController.getAvaliacoesPorPrestador);
router.get(
  "/:clienteId",
  authMiddleware,
  avaliacaoController.getAvaliacoesPorCliente
);
router.put(
  "/:prestadorId",
  authMiddleware,
  avaliacaoController.updateAvaliacao
);
router.put("/:clienteId", authMiddleware, avaliacaoController.updateAvaliacao);
router.delete(
  "/:prestadorId",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);
router.delete(
  "/:clienteId",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);

export default router;
