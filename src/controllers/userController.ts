import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/usersRepository";
import * as yup from "yup";
import { AppError } from "../errors/appError";

class UserController {
  async show(req: Request, res: Response) {
    const userRepository = getCustomRepository(UsersRepository);
    const users = await userRepository.find();
    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    try {
      const schema = yup.object().shape({
        name: yup.string().required("Nome é obrigatório"),
        email: yup
          .string()
          .email("Email deve ser um email válido")
          .required("Email é obrigatório"),
      });

      await schema.validate(req.body, { abortEarly: false });

      const userRepository = getCustomRepository(UsersRepository);

      const userAlreadyExists = await userRepository.findOne({ email });

      if (userAlreadyExists) {
        throw new AppError("User already exists");
      }

      const user = userRepository.create({
        name,
        email,
      });

      await userRepository.save(user);

      return res.status(201).json(user);
    } catch (error) {
      throw new AppError(error);
    }
  }
}

export { UserController };
