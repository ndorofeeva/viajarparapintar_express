import { Router } from "express";
import RouteController from "../controllers/route-controller";

class RouteRoutes {
  router = Router();
  controller = new RouteController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.get("/countries", this.controller.getCountries);
  }
}

export default new RouteRoutes().router;
