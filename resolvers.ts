import { GraphQLError } from "graphql";
import { APICity, APITime, CityModel } from "./types.ts";
import { Collection, ObjectId } from "mongodb";

export type Context = {
    CityCollection: Collection<CityModel>;
}

export const resolvers = {

    City:{
        id: (parent:CityModel):string => {
            return parent._id!.toString();
        }

    },

    Query:{

        getCity: async(_:unknown, args:{id:string},ctx:Context):Promise<CityModel|null> => {
            const city = await ctx.CityCollection.findOne({_id:new ObjectId(args.id)});
            return city;
        },

        getCities: async(_:unknown, __:unknown, ctx:Context):Promise<CityModel[]> => {
            const  cities = await ctx.CityCollection.find().toArray();
            return cities;
        }

    },

    Mutation:{

        addCity: async ( _:unknown, args:{name:string, country:string}, ctx:Context):Promise<CityModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("no api key");
            const {name, country} = args;
            const url = `https://api.api-ninjas.com/v1/city?name=${name}`;
            const data = await fetch(url,
                {
                    headers:{
                        "X-Api-Key":API_KEY
                    }
                }
            );
            if(data.status !== 200) throw new GraphQLError("api ninja error");
            const response:APICity[] = await data.json();
            const latitude = response[0].latitude;
            const longitude = response[0].longitude;
            const is_capital = response[0].is_capital;
            const population = response[0].population;

            const url2 = `https://api.api-ninjas.com/v1/timezone?lat=${response[0].latitude}&lon=${response[0].longitude}`;
            const data2 = await fetch(url2,
                {
                    headers:{
                        "X-Api-Key":API_KEY
                    }
                }
            );
            if(data2.status !== 200) throw new GraphQLError("api ninja error");

            const response2:APITime = await data2.json();
            const timezone = response2.timezone;

            const {insertedId} = await ctx.CityCollection.insertOne({
                name,
                country,
                latitude,
                longitude,
                population,
                is_capital,
                timezone
            })

            return {
                _id: insertedId,
                name,
                country,
                latitude,
                longitude,
                population,
                is_capital,
                timezone
            }
        }

    }
}