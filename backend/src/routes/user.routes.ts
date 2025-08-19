import { Router } from "express";
import {
  bulk,
  signIn,
  signUp,
  updateUserInformation,
} from "../controllers/user.controller";
import VerifyJWT from "../middlewares/verifyJWT.middleware";

const router = Router();

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);
router.route("/userUpdate").put(VerifyJWT, updateUserInformation);
router.route("/bulk").get(bulk);

export default router;
