const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const axios = require('axios');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                console.log(`${process.env.API_HOST}users/${args.id}`)
                return axios.get(`${process.env.API_HOST}users/${args.id}`)
                    .then(response => response.data);
            }
        },
        getAllUsers: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            args: {},
            resolve(parentValue, args) {
                return axios.get(`${process.env.API_HOST}users`)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});