import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/surveysRepository";
import { SurveyUserRepository } from "../repositories/surveyUserRepository";
import { UsersRepository } from "../repositories/usersRepository";
import SendMailService from "../services/sendMailService";
import path from "path";
import sendMailService from "../services/sendMailService";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) return res.status(400).json({ error: "User does not exists" });

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey)
      return res.status(400).json({ error: "Survey does not exists" });

    const surveyUSerAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ["user", "survey"],
    });

    const npsPath = path.resolve(
      __dirname,
      "..",
      "views",
      "emails",
      "npsMail.hbs"
    );

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL,
    };

    if (surveyUSerAlreadyExists) {
      await sendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(surveyUSerAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return res.json(surveyUser);
  }
}

export { SendMailController };
