import { Request, Response } from 'express';
import RouteRepository from '../repositories/route-repository'
import IRouteData, { ICountries, IRouteFilter } from '../models/route-model';

export default class RouteController {
  async getPreview(req: Request, res: Response) {
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
      const routes = await RouteRepository.getPreview(searchParams);
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

  async get(req: Request, res: Response) {
    const id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : 0;

    try {
      const routeDetailsData = await RouteRepository.get(id);
      const routeDetails = {...routeDetailsData[0], photos: routeDetailsData.map(data => data.photos) };
      res.status(200).send(routeDetails);
    } catch (err) {
      res.status(500).send({
        message: "Error occurred while retrieving routes."
      });
    }
  }
}
