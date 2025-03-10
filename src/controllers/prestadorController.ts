import type {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {uploadToDrive} from "../utils/googleDrive";
import upload from "../middlewares/uploadMiddleware";

const prisma = new PrismaClient();

// src/controllers/prestadorController.ts
export const getAllPrestadores = async (req: Request, res: Response) => {
  try {
    const prestadores = await prisma.prestador.findMany({
      include: {
        avaliacoes: true,
      },
    });

    const prestadoresComAvaliacao = prestadores.map((prestador) => {
      const totalAvaliacoes = prestador.avaliacoes.length;
      const somaNotas = prestador.avaliacoes.reduce(
        (acc, avaliacao) => acc + avaliacao.nota,
        0
      );
      const mediaNotas =
        totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : null;

      return {
        ...prestador,
        mediaNotas,
        totalAvaliacoes,
      };
    });

    res.json(prestadoresComAvaliacao);
  } catch (error) {
    res.status(400).json({error: "Erro ao listar prestadores."});
  }
};

export const getPrestador = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const prestador = await prisma.prestador.findUnique({
      where: {id: Number(id)},
    });
    if (!prestador)
      return res.status(404).json({error: "Prestador não encontrado."});
    res.json(prestador);
  } catch (error) {
    res.status(400).json({error: "Erro ao buscar prestador."});
  }
};

export const createPrestador = [
  upload.single("imagem"),
  async (req: Request, res: Response) => {
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
        descricao,
        linkedin,
        profissoes,
        plano,
      } = req.body;

      // Parse 'profissoes' from JSON string to array
      const profissoesArray = profissoes ? JSON.parse(profissoes) : [];

      // Upload da imagem para o Google Drive
      let imagemUrl: string | null = null;
      if (req.file) {
        imagemUrl = await uploadToDrive(req.file);
      }

      const prestadorExistente = await prisma.prestador.findUnique({
        where: {email},
      });
      if (prestadorExistente) {
        return res.status(400).json({error: "Email já cadastrado."});
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
          imagem: imagemUrl,
          descricao,
          linkedin,
          profissoes: profissoesArray, // Use the parsed array
          plano,
        },
      });

      res.status(201).json(prestador);
    } catch (error) {
      console.error("Erro ao criar prestador:", error);
      res.status(400).json({error: "Erro ao criar prestador."});
    }
  },
];

export const updatePrestador = [
  upload.single("imagem"),
  async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
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
        descricao,
        linkedin,
        profissoes,
        plano,
      } = req.body;

      // Parse 'profissoes' from JSON string to array
      const profissoesArray = profissoes ? JSON.parse(profissoes) : [];

      const updatedData: any = {
        nome,
        email,
        cpf,
        pais,
        estado,
        cidade,
        dataNascimento: new Date(dataNascimento),
        celular,
        descricao,
        linkedin,
        profissoes: profissoesArray, // Use the parsed array
        plano,
      };

      if (senha) {
        updatedData.senha = await bcrypt.hash(senha, 10);
      }

      if (req.file) {
        const imagemUrl = await uploadToDrive(req.file);
        updatedData.imagem = imagemUrl;
      }

      const prestador = await prisma.prestador.update({
        where: {id: Number(id)},
        data: updatedData,
      });

      res.json(prestador);
    } catch (error) {
      console.error("Erro ao atualizar prestador:", error);
      res
        .status(400)
        .json({error: "Erro ao atualizar prestador.", details: error.message});
    }
  },
];

export const deletePrestador = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await prisma.prestador.delete({where: {id: Number(id)}});
    res.status(204).send();
  } catch (error) {
    res.status(400).json({error: "Erro ao excluir prestador."});
  }
};

export const loginPrestador = async (req: Request, res: Response) => {
  try {
    const {email, senha} = req.body;
    const prestador = await prisma.prestador.findUnique({where: {email}});

    if (!prestador) {
      return res.status(401).json({error: "Email não encontrado."});
    }

    const senhaValida = await bcrypt.compare(senha, prestador.senha);
    if (!senhaValida) {
      return res.status(401).json({error: "Senha incorreta."});
    }

    const token = jwt.sign({id: prestador.id}, "chave-secreta", {
      expiresIn: "1h",
    });
    res.json({
      token: token,
      id: prestador.id,
      nome: prestador.nome,
      email: prestador.email,
      imagem: prestador.imagem,
      cpf: prestador.cpf,
      pais: prestador.pais,
      estado: prestador.estado,
      cidade: prestador.cidade,
      dataNascimento: prestador.dataNascimento,
      celular: prestador.celular,
      descricao: prestador.descricao,
      plano: prestador.plano,
      profissoes: prestador.profissoes,
      linkedin: prestador.linkedin,
      tipo: "prestador",
    });
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao fazer login.", details: error.message});
  }
};
