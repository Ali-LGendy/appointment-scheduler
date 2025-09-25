import "dotenv/config";

module.exports = {
    develpoment: {
        clint: pg,
        connection: process.env.DATABASE_URL || {
            host: process.env.DB_HOST,
            port:process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: "./migrations",
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
    production: {
        clint: pg,
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./migrations",
        },
        pool: {
            min: 2,
            max: 10,
        },
    }
}