import { Router } from "express";
import userRouter from "./user.routes";
import accountRouter from "./account.routes";

const router = Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;
