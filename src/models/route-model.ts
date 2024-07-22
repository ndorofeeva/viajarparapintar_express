import { RowDataPacket } from "mysql2"

export default interface IRouteData {
  routes: IRoute[];
  numberOfPages: number;
}

export interface IRoutesCount extends RowDataPacket {
  count: number;
}

export interface ICountries extends RowDataPacket {
  country: string;
}

export interface IRoute extends RowDataPacket {
  id: number,
  title: string,
  distance: number,
  duration: number,
  type: string,
  difficulty: string,
  country: string,
  imagepath: string
}

export interface IRouteFilter {
  countries?: string | string[],
  difficulty?: string,
  type: string,
  page: number,
  itemsPerPage: number;
}
