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
  }
}

export default new RouteRoutes().router;
