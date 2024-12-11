import type {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import upload from "../middlewares/uploadMiddleware";
import {uploadToDrive} from "../utils/googleDrive";

const prisma = new PrismaClient();

export const registerCliente = [
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
      } = req.body;

      let imagemUrl: string | null = null;
      if (req.file) {
        imagemUrl = await uploadToDrive(req.file);
      }

      const clienteExistente = await prisma.cliente.findUnique({
        where: {email},
      });
      if (clienteExistente) {
        return res.status(400).json({error: "E-mail já cadastrado."});
      }

      const hashedSenha = await bcrypt.hash(senha, 10);
      const cliente = await prisma.cliente.create({
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
        },
      });
      res.status(201).json(cliente);
    } catch (error: any) {
      res
        .status(400)
        .json({error: "Erro ao registrar cliente.", details: error.message});
    }
  },
];

export const loginCliente = async (req: Request, res: Response) => {
  try {
    const {email, senha} = req.body;
    const cliente = await prisma.cliente.findUnique({where: {email}});

    if (!cliente) {
      return res.status(401).json({error: "Email não encontrado."});
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({error: "Senha incorreta."});
    }

    const token = jwt.sign({id: cliente.id}, "chave-secreta", {
      expiresIn: "1h",
    });
    res.json({
      token: token,
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      imagem: cliente.imagem,
      cpf: cliente.cpf,
      pais: cliente.pais,
      estado: cliente.estado,
      cidade: cliente.cidade,
      dataNascimento: cliente.dataNascimento,
      celular: cliente.celular,
      tipo: "cliente",
    });
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao fazer login.", details: error.message});
  }
};

export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao buscar clientes.", details: error.message});
  }
};

export const getCliente = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const cliente = await prisma.cliente.findUnique({where: {id}});

    if (!cliente) {
      return res.status(404).json({error: "Cliente não encontrado."});
    }

    res.json(cliente);
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao buscar cliente.", details: error.message});
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const data = req.body;

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    const cliente = await prisma.cliente.update({
      where: {id},
      data,
    });

    res.json(cliente);
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao atualizar cliente.", details: error.message});
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    await prisma.cliente.delete({where: {id}});
    res.status(204).send();
  } catch (error) {
    res
      .status(400)
      .json({error: "Erro ao excluir cliente.", details: error.message});
  }
};
