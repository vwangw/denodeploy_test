import { OptionalId } from "mongodb"

export type City = {
    id: string,
    name:string,
    country:string,
    latitude:number,
    longitude:number,
    population:number,
    is_capital:boolean,
    timezone:string
}

export type CityModel = OptionalId<{
    name:string,
    country:string,
    latitude:number,
    longitude:number,
    population:number,
    is_capital:boolean,
    timezone:string
}>

export type APICity = {
    latitude:number,
    longitude:number,
    population:number,
    is_capital:boolean
}

export type APITime = {
    timezone:string
}