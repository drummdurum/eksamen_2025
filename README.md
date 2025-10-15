# BarToBar - Railway Deployment Guide

Dette projekt er en Node.js applikation, der kan deployes til Railway.

## 🚀 Railway Deployment

### Prerequisites
- Git repository
- Railway account
- PostgreSQL database (Railway kan levere dette)

### Deployment Steps

1. **Push koden til Git repository**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Connect til Railway**
   - Gå til [railway.app](https://railway.app)
   - Log ind med din GitHub konto
   - Klik "New Project"
   - Vælg "Deploy from GitHub repo"
   - Vælg dit repository

3. **Tilføj PostgreSQL Database**
   - I dit Railway projekt dashboard
   - Klik "New Service"
   - Vælg "Database" → "PostgreSQL"
   - Railway vil automatisk oprette database variabler

4. **Konfigurer Environment Variables**
   
   I Railway dashboard under "Variables" tilføj følgende:
   
   ```
   SESSION_SECRET=din_session_secret_nøgle
   GmailserviceAppKode=din_gmail_app_kode
   GoogleApiSearchKey=din_google_api_nøgle
   STRIPE_SECRET_KEY=din_stripe_secret_nøgle
   STRIPE_WEBHOOK_SECRET=din_stripe_webhook_secret
   ```

   **Database variabler oprettes automatisk af Railway:**
   - `PGUSER`
   - `PGPASSWORD` 
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`

5. **Opdater BASE_URL og DOMAIN**
   
   Efter deployment, opdater disse variabler med din Railway URL:
   ```
   BASE_URL=https://dit-projekt-navn.up.railway.app
   DOMAIN=https://dit-projekt-navn.up.railway.app
   ```

### 🗄️ Database Setup

Hvis du har eksisterende database data, skal du:

1. **Eksporter din lokale database**
   ```bash
   pg_dump -h localhost -U bartobar -d bartobar_db > backup.sql
   ```

2. **Importer til Railway database**
   - Brug Railway CLI eller pgAdmin
   - Connect til Railway PostgreSQL med de genererede credentials
   - Importer din backup.sql fil

### 🔧 Project Structure

```
├── app.js              # Main server file
├── package.json        # Dependencies and scripts
├── railway.toml        # Railway configuration
├── .env.example        # Environment variables template
├── database/           # Database setup files
├── public/             # Static files
├── serverAPI/          # API routes and middleware
├── serverSSR/          # Server-side rendering
└── util/               # Utility functions
```

### ⚙️ Development

For lokal development:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env med dine lokale værdier

# Start development server
npm run dev
```

### 🌐 Live URL

Efter deployment vil din app være tilgængelig på:
`https://dit-projekt-navn.up.railway.app`

### 📋 Post-Deployment Checklist

- [ ] Verificer at alle environment variables er sat korrekt
- [ ] Test database forbindelse
- [ ] Test Stripe payment integration
- [ ] Test Google API funktionalitet
- [ ] Test email funktionalitet
- [ ] Verificer at alle statiske filer indlæses korrekt

### 🔍 Troubleshooting

**Hvis deployment fejler:**

1. Check Railway logs i dashboard
2. Verificer at alle dependencies er i `package.json`
3. Sikr at `railway.toml` er korrekt konfigureret
4. Check at environment variables er sat

**Database forbindelsesproblemer:**
- Verificer PGHOST, PGUSER, PGPASSWORD variabler
- Check at database service kører i Railway
- Test forbindelse med pgAdmin eller psql

### 🛠️ Maintenance

- Monitor app performance i Railway dashboard
- Check logs for fejl
- Opdater dependencies regelmæssigt
- Backup database regelmæssigt

---

**Railway Support:** [docs.railway.app](https://docs.railway.app)