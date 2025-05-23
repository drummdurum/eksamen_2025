import Router from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/embedRoutes', (req, res) => {
  const { start, bars, mode } = req.query;
  const apiKey = process.env.GoogleApiSearchKey;

  if (!start || !bars) {
    return res.status(400).json({ error: 'Start og mindst én bar er påkrævet' });
  }

  const barArr = bars.split(';').map(s => s.trim()).filter(Boolean);
 
  const destination = barArr[barArr.length - 1];
  const waypoints = barArr.slice(0, -1).join('|');
  const travelMode = mode || 'walking';

  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&mode=${travelMode}`;

  res.json({ embedUrl });
});

export default router;