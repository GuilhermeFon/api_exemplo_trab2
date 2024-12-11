import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllReservas = async (req: Request, res: Response) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        cliente: true, // Incluir informações do cliente
        prestador: true, // Incluir informações do prestador
      },
    });
    res.status(200).json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar reservas. Tente novamente mais tarde." });
  }
};

// Controlador para obter uma reserva específica pelo ID
export const getReserva = async (req: Request, res: Response) => {
  const prestadorId = req.params.prestadorId ? Number(req.params.prestadorId) : undefined;
  const clienteId = req.params.clienteId ? req.params.clienteId : undefined;

  if (!prestadorId && !clienteId) {
    return res.status(400).json({ error: "Either prestadorId or clienteId must be provided." });
  }

  try {
    const reserva = await prisma.reserva.findMany({
      where: prestadorId
        ? { prestadorId: prestadorId }
        : { clienteId: clienteId },
      include: {
        cliente: true,
        prestador: true,
      },
    });

    if (reserva.length === 0) {
      return res.status(404).json({ error: "Reservas não encontradas." });
    }

    res.status(200).json(reserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar reservas. Tente novamente mais tarde." });
  }
};

// Controlador para criar uma nova reserva
export const createReserva = async (req: Request, res: Response) => {
  const { clienteId, prestadorId, data } = req.body;

  // Validação dos dados recebidos
  if (!clienteId || !prestadorId || !data) {
    return res.status(400).json({
      error: "Os campos clienteId, prestadorId e data são obrigatórios.",
    });
  }

  try {
    const reserva = await prisma.reserva.create({
      data: { clienteId, prestadorId, data: new Date(data) },
    });
    res.status(201).json(reserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar reserva. Tente novamente mais tarde." });
  }
};

// Controlador para atualizar uma reserva existente
export const updateReserva = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { clienteId, prestadorId, data, status } = req.body;

  // Validação dos dados recebidos
  if (!clienteId && !prestadorId && !data && !status) {
    return res.status(400).json({
      error: "Pelo menos um campo deve ser fornecido para atualização.",
    });
  }

  try {
    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        clienteId,
        prestadorId,
        data: data ? new Date(data) : undefined,
        status,
      },
    });

    res.status(200).json(reserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar reserva. Tente novamente mais tarde." });
  }
};

// Controlador para excluir uma reserva
export const deleteReserva = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.reserva.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir reserva. Tente novamente mais tarde." });
  }
};