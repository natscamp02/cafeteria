require('dotenv').config({ path: './secrets.env' });
const conn = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
conn.connect(() => console.log(`Connected to database...`));
