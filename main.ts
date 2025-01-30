import {MongoClient} from "mongodb";
import {ApolloServer} from "@apollo/server";
import { CityModel } from "./types.ts";
import { schema } from "./schema.ts";
import {startStandaloneServer} from "@apollo/server/standalone";
import {resolvers} from "./resolvers.ts";


const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("ciudades");
const CityCollection = mongoDB.collection<CityModel>("ciudad");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({CityCollection})
})

console.info(`Server at ${url}` );