import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUserRepository } from "../repositories/surveyUserRepository";

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveysUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;
    const promotors = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promotors - detractors) / totalAnswers) * 100).toFixed(2)
    );

    return res.json({
      detractors,
      promotors,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };
