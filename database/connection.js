import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // det er en rapper import, som gør det muligt at åbne en database og køre SQL-forespørgsler på den.

// Opretter forbindelse til SQLite-databasen
const connection = await open({
  filename: 'users.db',
  driver: sqlite3.Database,
});

export default connection; // eksportere connection objektet, så det kan bruges i andre filer. Det er en god praksis at have en central databaseforbindelse, som kan genbruges i hele applikationen.