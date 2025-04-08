import userRoute from "./user-routes.js";

const initRoutes = (app) => {
  app.use("/user", userRoute);
};

export default initRoutes;
