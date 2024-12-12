import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

// Criar uma nova avaliação
export const createAvaliacao = async (req: Request, res: Response) => {
  try {
    const {clienteId, prestadorId, nota, comentario} = req.body;

    if (!clienteId || !prestadorId || nota === undefined) {
      return res.status(400).json({
        error: "Os campos clienteId, prestadorId e nota são obrigatórios.",
      });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        cliente: {connect: {id: clienteId}},
        prestador: {connect: {id: prestadorId}},
        nota,
        comentario,
      },
    });

    res.status(201).json(avaliacao);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao criar avaliação.",
      details: error.message,
    });
  }
};

// Obter uma avaliação específica pelo ID
export const getAvaliacao = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: {id: Number(id)},
      include: {
        cliente: true,
        prestador: true,
      },
    });

    if (!avaliacao) {
      return res.status(404).json({error: "Avaliação não encontrada."});
    }

    res.status(200).json(avaliacao);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao buscar avaliação.",
      details: error.message,
    });
  }
};

// Atualizar uma avaliação existente
export const updateAvaliacao = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {nota, comentario} = req.body;

  try {
    const avaliacao = await prisma.avaliacao.update({
      where: {id: Number(id)},
      data: {nota, comentario},
    });

    res.status(200).json(avaliacao);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao atualizar avaliação.",
      details: error.message,
    });
  }
};

// Excluir uma avaliação
export const deleteAvaliacao = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.avaliacao.delete({
      where: {id: Number(id)},
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao excluir avaliação.",
      details: error.message,
    });
  }
};

// Obter avaliações por prestador
export const getAvaliacoesPorPrestador = async (
  req: Request,
  res: Response
) => {
  const {prestadorId} = req.params;

  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {prestadorId: Number(prestadorId)},
      include: {
        cliente: true,
      },
    });

    const totalAvaliacoes = avaliacoes.length;
    const somaNotas = avaliacoes.reduce(
      (acc, avaliacao) => acc + avaliacao.nota,
      0
    );
    const mediaNotas = totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

    res.status(200).json({
      avaliacoes,
      totalAvaliacoes,
      mediaNotas,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao buscar avaliações.",
      detalhes: error.message,
    });
  }
};

// Obter avaliações por cliente
export const getAvaliacoesPorCliente = async (req: Request, res: Response) => {
  const {clienteId} = req.params;

  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {clienteId},
      include: {
        prestador: true,
      },
    });

    res.status(200).json(avaliacoes);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao buscar avaliações.",
      details: error.message,
    });
  }
};
