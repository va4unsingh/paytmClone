import { Router } from "express";
import { profilePage, signIn, signUp } from "../controllers/user.controller";
import VerifyJWT from "../middlewares/middleware";

const router = Router();

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);
router.route("/user").post(userUpdate);

export default router;
