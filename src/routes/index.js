import userRoute from "./user-routes.js";
import financeRoute from "./finance-route.js"

const initRoutes = (app) => {
  app.use("/user", userRoute);
  app.use("/finance",financeRoute);
};

export default initRoutes;
