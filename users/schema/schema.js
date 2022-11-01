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

// Define company type above user type.
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                const { id } = { ...parentValue };
                return axios.get(`${process.env.API_HOST}company/${id}/users`)
                    .then(response => response.data)
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                const { companyId } = { ...parentValue };
                return axios.get(`${process.env.API_HOST}company/${companyId}`)
                    .then(response => response.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
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
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${process.env.API_HOST}company/${args.id}`)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});