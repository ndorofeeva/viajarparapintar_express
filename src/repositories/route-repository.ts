import connection from '../db';
import { IRouteFilter, IRoute, IRoutesCount, ICountries, IRouteDetails } from '../models/route-model';

interface IRouteRepository {
  getPreview(searchParams: IRouteFilter): Promise<IRoute[]>;
}

class RouteRepository implements IRouteRepository {
  getPreview(searchParams: IRouteFilter): Promise<IRoute[]> {
    const query = `SELECT id, title, distance, type, difficulty, country, preview_image as previewImage FROM route 
      ${this.getConditionalQuery(searchParams)} 
      limit ${(searchParams.page - 1) * searchParams.itemsPerPage}, ${searchParams.itemsPerPage}`;

    return new Promise((resolve, reject) => {
      connection.query<IRoute[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  get(id: number): Promise<IRouteDetails[]> {
    const query = `SELECT 
    r.id, r.title, r.distance, r.type, r.difficulty, r.country, r.preview_image as previewImage,
    r.highlighted_text as highlightedText, r.main_text as mainText, rf.photo_name as photos
    FROM route as r join route_photos as rf on rf.route_id = r.id where r.id = ${id}`;

    return new Promise((resolve, reject) => {
      connection.query<IRouteDetails[]>(query, (err, res) => {
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
