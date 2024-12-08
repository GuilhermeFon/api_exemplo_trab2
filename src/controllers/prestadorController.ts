import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getAllPrestadores = async (req: Request, res: Response) => {
  try {
    const prestadores = await prisma.prestador.findMany();
    res.json(prestadores);
  } catch (error) {
    res.status(400).json({ error: "Erro ao listar prestadores." });
  }
};

export const getPrestador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prestador = await prisma.prestador.findUnique({
      where: { id: Number(id) },
    });
    if (!prestador)
      return res.status(404).json({ error: "Prestador não encontrado." });
    res.json(prestador);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar prestador." });
  }
};

export const createPrestador = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      email,
      senha,
      cpf,
      pais,
      estado,
      cidade,
      dataNascimento,
      celular,
      imagem,
      descricao,
      linkedin,
      profissoes,
      plano,
    } = req.body;

    // Handle 'imagem' correctly
    const imagemValue = typeof imagem === 'string' ? imagem : null;

    const prestadorExistente = await prisma.prestador.findUnique({ where: { email } });
    if (prestadorExistente) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const prestador = await prisma.prestador.create({
      data: {
        nome,
        email,
        senha: hashedSenha,
        cpf,
        pais,
        estado,
        cidade,
        dataNascimento: new Date(dataNascimento),
        celular,
        imagem: imagemValue, // Use the correct value
        descricao,
        linkedin,
        profissoes,
        plano,
      },
    });

    res.status(201).json(prestador);
  } catch (error) {
    console.error('Erro ao criar prestador:', error);
    res.status(400).json({ error: 'Erro ao criar prestador.' });
  }
};

export const updatePrestador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, cpf, pais, estado, cidade, dataNascimento, celular, imagem, descricao, linkedin, profissoes, plano } = req.body;

    if (senha) {
      req.body.senha = await bcrypt.hash(senha, 10);
    }

    const prestador = await prisma.prestador.update({
      where: { id: Number(id) },
      data: { nome, email, senha: req.body.senha, cpf, pais, estado, cidade, dataNascimento: new Date(dataNascimento), celular, imagem, descricao, linkedin, profissoes, plano },
    });

    res.json(prestador);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar prestador." });
  }
};

export const deletePrestador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.prestador.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir prestador." });
  }
};

export const loginPrestador = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const prestador = await prisma.prestador.findUnique({ where: { email } });

    if (!prestador) {
      return res.status(401).json({ error: "Email não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, prestador.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign({ id: prestador.id }, "chave-secreta", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Erro ao fazer login.", details: error.message });
  }
};