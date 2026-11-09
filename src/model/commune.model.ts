import { CityModel } from "./city.model"
import { CountryModel } from "./country.model"
import { RegionModel } from "./region.model"

export interface CommuneModel {
  id: number
  cityId: number
  name: string
  siiCode?: string
  tgrCode?: string
  city: Omit<CityModel, 'region' | 'regionId'>
  region: Omit<RegionModel, 'country' | 'countryId'>
  country: Omit<CountryModel, 'nationality'>
}

export type CommuneRequestCreate = Omit<CommuneModel, 'id' | 'city' | 'region' | 'country'>
export type CommuneRequestUpdate = Omit<CommuneModel, 'city' | 'region' | 'country'>
export type CommuneWriteResponse = CommuneRequestUpdate