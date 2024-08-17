import { Router } from "express";
import RouteController from "../controllers/route-controller";

class RouteRoutes {
  router = Router();
  controller = new RouteController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", this.controller.getPreview);
    this.router.get("/countries", this.controller.getCountries);
    this.router.get("/details/:id", this.controller.get);
  }
}

export default new RouteRoutes().router;
