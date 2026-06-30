const Pool = require('pg').Pool
const pool = new Pool( {
    user: "postgres",
    password: "03062004tim",
    host: "localhost",
    port: 5432,
    database: "s4w_final"
})

pool.on('connect', () => {
    console.log('Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
    console.error('Ошибка PostgreSQL:', err);
});

module.exports = pool

// deleteworks 1. почему то проге похуй на пользователя 2. если выбирать только subcontent то не удаляется