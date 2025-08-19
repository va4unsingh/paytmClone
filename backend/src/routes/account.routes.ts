import { Router } from "express";
import {
  accountBalance,
  transferMoneyToAnotherAccount,
} from "../controllers/user.controller";
import VerifyJWT from "../middlewares/verifyJWT.middleware";

const router = Router();

router.route("/balance").get(VerifyJWT, accountBalance);
router.route("/transfer").post(VerifyJWT, transferMoneyToAnotherAccount);

export default router;
