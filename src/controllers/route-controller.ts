import { Request, Response } from 'express';
import RouteRepository from '../repositories/route-repository'

export default class RouteController {
  async getAll(req: Request, res: Response) {
    const countries = typeof req.query.countries === 'string' || Array.isArray(req.query.countries) ? req.query.countries : '';

    try {
      /* @ts-ignore */
      const routes = await RouteRepository.getAll({ countries: countries });

      res.status(200).send(routes);
    } catch (err) {
      res.status(500).send({
        message: "Error occurred while retrieving routes."
      });
    }
  };
}
