import knexLib from 'knex';
import knexConfig from '../knexfile.cjs';
import "dotenv/config";

const env = process.env.NODE_ENV;
const config = knexConfig[env];
const db = knexLib(config);

export default db;