import knex from 'knex'

const dbConnect = () => {
  return knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: {rejectUnauthorized: false},
    },
  })
}

export default dbConnect
