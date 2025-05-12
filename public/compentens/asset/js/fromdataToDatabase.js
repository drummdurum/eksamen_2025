import barsData from '../DB/data.json' assert { type: 'json' };
import db from '../../../../database/connection.js';

const bars = barsData.results || [];

for (const bar of bars) {
    const name = bar.name;
    const rating = bar.rating;
    const user_ratings_total = bar.user_ratings_total;
    const vicinity = bar.vicinity || bar.formatted_address;

    const result = await db.run(`
        INSERT INTO bars (name, rating, user_ratings_total, vicinity)
        VALUES (?, ?, ?, ?)
    `, [name, rating, user_ratings_total, vicinity]);

    const barId = result.lastID;

    const skipTypes = ["lodging", "point_of_interest", "establishment"];

    const filteredTypes = bar.types.filter(type => !skipTypes.includes(type));

    for (const type of filteredTypes) {
    await db.run(`
        INSERT INTO bar_types (bar_id, type)
        VALUES (?, ?)
    `, [barId, type]);
}
    console.log(`Indsat bar ${name} med id ${barId} og ${bar.types.length} typer`);
}