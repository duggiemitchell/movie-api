const { ApolloServer, gql } = require('apollo-server');

// define the schema way to define the types of the data
// ids are important for making sure it doesnt break on the frontend and for caching
// ! is for non nullable fields, it is important to think about the things that need to have a value in order to be queried
const typeDefs = gql`
        # Movie data
        enum Status {
                WATCHED
                INTERESTED
                NOT_INTERESTED
                UNKOWN
        }

        type Actor {
                id: ID!
                name: String!
        }
        type Movie {
                id: ID!
                title: String
                releaseDate: String
                rating: Int
                status: Status
                actor: [Actor]
        }
        # type of query needs to be the things that you are returning
        # also needs to define arguments for query
        type Query {
                movies: [Movie]
                movie(id: ID): Movie
        }
`;
// defing some movies here, maybe replace with DB?
const movies = [
        {
                id: 'hfufhdaefd',
                title: '5 Deadly Venoms',
                relaseDate: '10-10-1983',
                rating: 5,
                actor: [{ id: 'kflekf', name: 'Gordon Lu' }]
        },
        {
                id: 'soifjodfj',
                title: '36th Chamber',
                relaseDate: '10-10-1983',
                rating: 5
        }
];
// if something (data) exists in types, it must have a resolver (function)
// how we can pass arguments into our queries
// args - actual arguments passed in query
// context - a way to set user info for auth, etc
// info - contains info on the request ?
// when using a database, these can be find commands
// c
const resolvers = {
        Query: {
                movies: () => movies,
                movie: (obj, { id }, context, info) =>
                        movies.find(movie => movie.id === id)
        }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({
        port: process.env.PORT || 4000
}).then(({ url }) => {
        console.log(`Server started at ${url}`);
});
