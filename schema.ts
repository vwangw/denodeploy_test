export const schema = `#graphql
    type City{
        id:ID!
        name:String!
        country:String!
        latitude:Float!
        longitude:Float!
        population:Int!
        is_capital:Boolean!
        timezone:String!
        
    },

    type Query{
        getCity(id: ID!): City!
        getCities:[City!]!
    },

    type Mutation{
        addCity(name:String!, country:String!):City!
        updateCity(id:ID!, name:String, country:String):City!
        deleteCity(id:ID!):Boolean!
    }
`