import connection from '../db';
import Route, { IRouteFilter } from '../models/route-model';

interface IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<Route[]>;
}

class RouteRepository implements IRouteRepository {
  getAll(searchParams: IRouteFilter): Promise<Route[]> {
    let query: string = 'SELECT * FROM route';

    if(searchParams.countries && (typeof searchParams.countries === 'string' || searchParams.countries.length > 0)) {
      if (typeof searchParams.countries === 'string') query = `${query} WHERE country = '${searchParams.countries}'`;
      else query = `${query} WHERE country in (${searchParams.countries.map(country => `'${country}'`).join()})`;
      //TODO add filters, edit query
    }

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
