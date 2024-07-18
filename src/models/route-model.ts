import { RowDataPacket } from "mysql2"

export default interface Route extends RowDataPacket {
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
  type: string
}
