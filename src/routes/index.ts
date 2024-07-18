import { Application } from "express";
import routeRoutes from "./route-routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/routes", routeRoutes);
  }
}
