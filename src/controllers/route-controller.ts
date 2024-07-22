import { Request, Response } from 'express';
import RouteRepository from '../repositories/route-repository'
import IRouteData, { ICountries, IRouteFilter } from '../models/route-model';

export default class RouteController {
  async getAll(req: Request, res: Response) {
    const countries = typeof req.query.countries === 'string' || Array.isArray(req.query.countries) ? req.query.countries : '';
    const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : '';
    const type = typeof req.query.type === 'string' ? req.query.type : '';
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : undefined;
    const itemsPerPage = typeof req.query.itemsPerPage === 'string' ? parseInt(req.query.itemsPerPage, 10) : undefined;

    if(!page || isNaN(page) || !itemsPerPage || isNaN(itemsPerPage)) {
      res.status(500).send({
        message: "Error occurred with pagination."
      });
      return;
    }

    try {
      const searchParams: IRouteFilter = {
        /* @ts-ignore */
        countries: countries,
        difficulty: difficulty,
        type: type,
        page: page,
        itemsPerPage: itemsPerPage,
      };
      const routes = await RouteRepository.getAll(searchParams);
      const numberOfRoutesResult = await RouteRepository.countRoutes(searchParams);
      const numberOfPages = Math.ceil(numberOfRoutesResult[0].count / searchParams.itemsPerPage);
      const routeData: IRouteData = {
        routes: routes,
        numberOfPages: numberOfPages,
      }
      res.status(200).send(routeData);
    } catch (err) {
      res.status(500).send({
        message: "Error occurred while retrieving routes."
      });
    }
  };

  async getCountries(req: Request, res: Response) {
    try {
      const countryObjects: ICountries[] = await RouteRepository.getCountries();
      const countries = countryObjects.map(countryObj => countryObj.country);
      res.status(200).send(countries);
    } catch (err) {
      res.status(500).send({
        message: "Error occurred while retrieving routes."
      });
    }
  }
}
