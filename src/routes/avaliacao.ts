// AVALIACAO.TS
import {Router} from "express";
import * as avaliacaoController from "../controllers/avaliacaoController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

// Criação de avaliação
router.post(
  "/prestador/:prestadorId",
  authMiddleware,
  avaliacaoController.createAvaliacao
);
router.post(
  "/cliente/:clienteId",
  authMiddleware,
  avaliacaoController.createAvaliacao
);

// Obter avaliações
router.get(
  "/prestador/:prestadorId",
  avaliacaoController.getAvaliacoesPorPrestador
);
router.get("/cliente/:clienteId", avaliacaoController.getAvaliacoesPorCliente);
router.get("/:id", avaliacaoController.getAvaliacao);

// Atualizar avaliação
router.put(
  "/prestador/:prestadorId",
  authMiddleware,
  avaliacaoController.updateAvaliacao
);
router.put(
  "/cliente/:clienteId",
  authMiddleware,
  avaliacaoController.updateAvaliacao
);

// Deletar avaliação
router.delete(
  "/prestador/:prestadorId",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);
router.delete(
  "/cliente/:clienteId",
  authMiddleware,
  avaliacaoController.deleteAvaliacao
);

export default router;
