import connection from '../db';
import { IRouteFilter, IRoute, IRoutesCount, ICountries } from '../models/route-model';

interface IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<IRoute[]>;
}

class RouteRepository implements IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<IRoute[]> {
    const query = `SELECT * FROM route 
      ${this.getConditionalQuery(searchParams)} 
      limit ${(searchParams.page - 1) * searchParams.itemsPerPage}, ${searchParams.itemsPerPage}`;

    return new Promise((resolve, reject) => {
      connection.query<IRoute[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  countRoutes(searchParams: IRouteFilter): Promise<IRoutesCount[]> {
    const query = `SELECT count(id) as count FROM route ${this.getConditionalQuery(searchParams)}`;
    
    return new Promise((resolve, reject) => {
      connection.query<IRoutesCount[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  getCountries(): Promise<ICountries[]> {
    let query = 'SELECT distinct country FROM route';

    return new Promise((resolve, reject) => {
      connection.query<ICountries[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  private getConditionalQuery(searchParams: IRouteFilter) {
    let queryConditions = [];

    if(searchParams.countries && (typeof searchParams.countries === 'string' || searchParams.countries.length > 0)) {
      if (typeof searchParams.countries === 'string') queryConditions.push(`country = '${searchParams.countries}'`);
      else queryConditions.push(`country in (${searchParams.countries.map(country => `'${country}'`).join()})`);
    }
    if(searchParams.difficulty) queryConditions.push(`difficulty = '${searchParams.difficulty}'`);
    if(searchParams.type) queryConditions.push(`type = '${searchParams.type}'`);

    return queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';
  }
}

export default new RouteRepository();
