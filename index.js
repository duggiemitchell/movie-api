const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
// define the schema way to define the types of the data
// ids are important for making sure it doesnt break on the frontend and for caching
// ! is for non nullable fields, it is important to think about the things that need to have a value in order to be queried
const typeDefs = gql`
        # Movie data
        scalar Date # lets you control how data is coming in and out
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
const actors = [
        {
                id: 'gordon',
                name: 'Gordon Liu'
        },
        { id: 'jackie', name: 'Jackie Chan' }
];
// defing some movies here, maybe replace with DB?
const movies = [
        {
                id: 'hfufhdaefd',
                title: '5 Deadly Venoms',
                relaseDate: new Date('10-10-1983'),
                rating: 5,
                actor: [{ id: 'gordon', name: 'Gordon Lu' }]
        },
        {
                id: 'soifjodfj',
                title: '36th Chamber',
                relaseDate: new Date('10-10-1983'),
                rating: 5
        }
];
// if something (data) exists in types, it must have a resolver (function)
// how we can pass arguments into our queries
// args - actual arguments passed in query
// context - a way to set user info for auth, etc
// info - contains info on the request ?
// when using a database, these can be find commands
const resolvers = {
        Query: {
                movies: () => movies,
                movie: (obj, { id }, context, info) =>
                        movies.find(movie => movie.id === id)
        },
        Movie: {
                actor: (obj, arg, context) => {
                        const actorIds = obj.actors.map(actor => actor.id);
                        return actors.filter(actor =>
                                actorIds.includes(actor.id)
                        );
                }
        },
        Date: new GraphQLScalarType({
                name: 'Date',
                description: "It's a date",
                parseValue(value) {
                        // value from the client, want to make sure if coming in as a string then we can create a date for it
                        return new Date(value);
                },
                serialize(value) {
                        // value sent to the client, want to make sure we can get the serialized time from the database
                        return value.getTime();
                },
                parseLiteral(ast) {
                        if (ast.kind === Kind.INT) {
                                return new Date(ast.value);
                        }
                        return null;
                }
        })
};

const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true
});

server.listen({
        port: process.env.PORT || 4000
}).then(({ url }) => {
        console.log(`Server started at ${url}`);
});

process.once('SIGUSR2', function() {
        server.close(function() {
                process.kill(process.pid, 'SIGUSR2');
        });
});
