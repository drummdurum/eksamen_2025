import fetch from 'node-fetch';
import 'dotenv/config';

const GOOGLE_API_KEY = process.env.GoogleApiSearchKey;

export async function sendBarPhoto({ photoReference, placeId, db, barId, res }) {
    // Prøv først med eksisterende photo_reference
    if (photoReference) {
        const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(googleUrl);

        if (response.ok) {
            res.set('Content-Type', response.headers.get('content-type'));
            // Brug .pipe direkte, da node-fetch allerede returnerer en PassThrough-stream
            return response.body.pipe(res);
        }
    }

    // Hvis ikke, prøv at hente nyt photo_reference via place_id
    if (placeId) {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        if (
            detailsData.result &&
            detailsData.result.photos &&
            detailsData.result.photos[0] &&
            detailsData.result.photos[0].photo_reference
        ) {
            const newPhotoReference = detailsData.result.photos[0].photo_reference;
            // Opdater databasen
            if (db && barId) {
                await db.run('UPDATE bars SET photo_reference = ? WHERE id = ?', [newPhotoReference, barId]);
            }
            // Prøv at sende billedet igen
            return sendBarPhoto({ photoReference: newPhotoReference, placeId, db, barId, res });
        }
    }

    // Hvis alt fejler
    return res.status(404).send('Kunne ikke hente billede, selv med opdateret reference');
}