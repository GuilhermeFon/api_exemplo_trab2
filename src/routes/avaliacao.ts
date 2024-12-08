import {Router} from "express";
import * as avaliacaoController from "../controllers/avaliacaoController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/avaliacao/prestador",
  authMiddleware,
  avaliacaoController.createAvaliacao
);
router.post(
  "/avaliacao/cliente",
  authMiddleware,
  avaliacaoController.createAvaliacao
);
router.get("/avaliacao/prestador/:id", avaliacaoController.getAvaliacao);
router.get("/avaliacao/cliente/:id", avaliacaoController.getAvaliacao);
router.get(
  "/prestador/:prestadorId",
  avaliacaoController.getAvaliacoesPorPrestador
);
router.get(
  "/cliente/:clienteId",
  authMiddleware,
  avaliacaoController.getAvaliacoesPorCliente
);
router.put(
  "/avaliacao/prestador/:id",
  authMiddleware,
  avaliacaoController.updateAvaliacao
);
router.put(
  "/avaliacao/cliente/:id",
  authMiddleware,
  avaliacaoController.updateAvaliacao
);
router.delete(
  "/avaliacao/prestador/:id",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);
router.delete(
  "/avaliacao/cliente/:id",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);

export default router;
