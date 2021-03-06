import {ApolloServer, gql} from 'apollo-server-micro'
import dbConnect from 'dbConnect'

const typeDefs = gql`
  type Query {
    addresses: [Address!]!
    address(id: ID!): Address
  }
  type Address {
    id: ID!
    dawa_id: String
    name: String
    postal_code: String
    city: String
    street: String
    number: String
    floor: String
    extra: String
    lng: Float
    lat: Float
    matrikelnr: String
  }
  type Mutation {
    createAddress(dawaId: ID!): CreateAddressMutation
    deleteAddress(id: ID!): DeleteAddressMutation
  }
  type CreateAddressMutation {
    address: Address
  }
  type DeleteAddressMutation {
    address: Address
  }
`

const resolvers = {
  Query: {
    async addresses(parent, args, context) {
      const addresses = await context.db.select('*').from('addresses')

      return addresses
    },
    async address(parent, args, context) {
      const address = await context.db
        .select('*')
        .from('addresses')
        .where({id: args.id})
        .first()

      return address
    },
  },
  Mutation: {
    async createAddress(parent, args, context) {
      const existingAddress = await context.db
        .select('*')
        .from('addresses')
        .where({dawa_id: args.dawaId})
        .first()
      if (existingAddress) {
        return {
          address: existingAddress,
        }
      } else {
        const result = await fetch('https://dawa.aws.dk/adresser/' + args.dawaId)
        const json = await result.json()
        const addresses = await context
          .db('addresses')
          .insert({
            dawa_id: json.id,
            name: json.adressebetegnelse,
            postal_code: json.adgangsadresse.postnummer.nr,
            city: json.adgangsadresse.postnummer.navn,
            street: json.adgangsadresse.vejstykke.navn,
            number: json.adgangsadresse.husnr,
            floor: json.etage,
            extra: json.dør,
            lng: json.adgangsadresse.adgangspunkt.koordinater[0],
            lat: json.adgangsadresse.adgangspunkt.koordinater[1],
            matrikelnr: json.adgangsadresse.matrikelnr,
          })
          .returning('*')

        return {
          address: addresses[0],
        }
      }
    },
    async deleteAddress(parent, args, context) {
      const address = await context.db
        .select('*')
        .from('addresses')
        .where({id: args.id})
        .first()
      await context
        .db('addresses')
        .where({id: args.id})
        .del()

      return {address}
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({db: req.db}),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

// There is no connection pool service on Heroku's free pg så every request opens and closes a db connection.
// This limits request concurrency to around 20 which should be fine for this project.
const dbHandler = (handler) => async (req, res) => {
  req.db = dbConnect()
  await handler(req, res)
  await req.db.destroy()
  return
}

export default dbHandler(apolloServer.createHandler({path: '/api/graphql'}))
