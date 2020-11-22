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
    name_without_city: String
    postal_code: String
    city: String
    street: String
    number: String
    floor: String
    extra: String
    lng: String
    lat: String
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

const formatAddress = (address) => ({
  ...address,
  name_without_city: address.name.replace(`\, ${address.postal_code} ${address.city}`, ''),
})

const resolvers = {
  Query: {
    async addresses(parent, args, context) {
      const addresses = await context.db
        .select('*')
        .from('addresses')
        .orderBy(['postal_code', 'name'])
      // .orderBy("year", "asc")
      // .limit(Math.min(args.first, 50))
      // .offset(args.skip);
      return addresses.map(formatAddress)
    },
    async address(parent, args, context) {
      const address = await context.db
        .select('*')
        .from('addresses')
        .where({id: args.id})
        .first()
      return formatAddress(address)
    },
  },
  Mutation: {
    async createAddress(parent, args, context) {
      const result = await fetch('https://dawa.aws.dk/adresser/' + args.dawaId)
      const json = await result.json()
      LOG(json)
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

      // http://maps.google.com/maps?q=&layer=c&cbll=55.69150815,12.5590054&cbp=11,0,0,0,0
      // http://maps.google.com/maps?q=&layer=c&cbll=55.69156324,12.55890185&cbp=11,0,0,0,0
      return {
        address: addresses[0],
        // address: null,
      }
    },
    async deleteAddress(parent, args, context) {
      const addresses = await context
        .db('addresses')
        .where({id: args.id})
        .del()
      LOG(addresses)
      return {
        address: addresses[0],
      }
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

const dbHandler = (handler) => async (req, res) => {
  req.db = dbConnect()
  await handler(req, res)
  await req.db.destroy()
  return
}

export default dbHandler(apolloServer.createHandler({path: '/api/graphql'}))
