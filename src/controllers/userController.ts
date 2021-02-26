import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/usersRepository";

class UserController {
  async show(req: Request, res: Response) {
    const userRepository = getCustomRepository(UsersRepository);
    const users = await userRepository.find();
    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const user = userRepository.create({
      name,
      email,
    });

    await userRepository.save(user);

    return res.status(201).json(user);
  }
}

export { UserController };
