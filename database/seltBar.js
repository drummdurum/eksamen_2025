
import db from './../database/connection.js';

await db.run('DELETE FROM bars WHERE id = ?', [59]);