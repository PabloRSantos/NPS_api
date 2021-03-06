import { Router } from "express";
import { AnswerController } from "./controllers/answerController";
import { NpsController } from "./controllers/NpsController";
import { SendMailController } from "./controllers/sendMailController";
import { SurveysController } from "./controllers/surveysController";
import { UserController } from "./controllers/userController";

const router = Router();
const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);
router.get("/users", userController.show);

router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

export { router };
