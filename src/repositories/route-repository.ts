import connection from '../db';
import Route, { IRouteFilter } from '../models/route-model';

interface IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<Route[]>;
}

class RouteRepository implements IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<Route[]> {
    let query: string = 'SELECT * FROM route';
    let queryConditions = [];

    if(searchParams.countries && (typeof searchParams.countries === 'string' || searchParams.countries.length > 0)) {
      if (typeof searchParams.countries === 'string') queryConditions.push(`country = '${searchParams.countries}'`);
      else queryConditions.push(`country in (${searchParams.countries.map(country => `'${country}'`).join()})`);
    }
    if(searchParams.difficulty) queryConditions.push(`difficulty = '${searchParams.difficulty}'`);
    if(searchParams.type) queryConditions.push(`type = '${searchParams.type}'`);

    if(queryConditions.length > 0) query = `${query} WHERE ${queryConditions.join(' AND ')}`

    console.log(query);

    return new Promise((resolve, reject) => {
      connection.query<Route[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}

export default new RouteRepository();
