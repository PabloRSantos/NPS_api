import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/surveysRepository";
import { Request, Response } from "express";

class SurveysController {
  async show(req: Request, res: Response) {
    const surveyRepository = getCustomRepository(SurveysRepository);
    const allSurveys = await surveyRepository.find();
    return res.json(allSurveys);
  }
  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveysRepository);

    const newSurvey = surveyRepository.create({ title, description });
    await surveyRepository.save(newSurvey);

    return res.status(201).json(newSurvey);
  }
}

export { SurveysController };
