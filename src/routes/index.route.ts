import { Router } from "express";
import IndexController from "@controllers/index.controller";
import { Routes } from "@interfaces/routes.interface";

import { ApiRoutes } from "@/utils/apiRoutes";

class IndexRoute implements Routes {
  public path = ApiRoutes.API;
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
