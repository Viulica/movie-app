# Setup Upute - Drumre Lab 1

## Environment Varijable

Dodaj sljedeće varijable u `.env.local`:

```env
# MongoDB Connection (već imaš)
MONGODB_URI="mongodb+srv://dermitstela_db_user:1VTirHtkY78l4uw4@cluster0.95xtgi0.mongodb.net/dm_lab1_baza?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=iWHME7oqIsG0izDV8++YbfSXGKtN0fusct0RbJ3qbiw=

# Google OAuth (dodaj nakon što kreiraš OAuth client)
GOOGLE_CLIENT_ID=ovdje-stavi-tvoj-google-client-id
GOOGLE_CLIENT_SECRET=ovdje-stavi-tvoj-google-client-secret

# TheMovieDB API
TMDB_API_KEY=ovdje-stavi-tvoj-tmdb-api-key

# Last.fm API
LASTFM_API_KEY=ovdje-stavi-tvoj-lastfm-api-key
```

## Kako dobiti API ključeve

### 1. Google OAuth (NextAuth)
- Google Cloud Console → APIs & Services → Credentials
- Create Credentials → OAuth client ID
- Application type: Web application
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- Kopiraj Client ID i Client Secret

### 2. TheMovieDB API
- Registriraj se na https://www.themoviedb.org/
- Settings → API → Request an API Key
- Kopiraj API key

### 3. Last.fm API
- Registriraj se na https://www.last.fm/api
- Create API Account
- Kopiraj API key

## Pokretanje aplikacije

```bash
npm install
npm run dev
```

Aplikacija će biti dostupna na http://localhost:3000

## Funkcionalnosti

✅ Google OAuth prijava
✅ Automatsko spremanje korisnika u MongoDB
✅ Dohvat filmova iz TheMovieDB API-ja
✅ Dohvat glazbe iz Last.fm API-ja
✅ Spremanje podataka u MongoDB
✅ Prikaz podataka (ne JSON format)
✅ Filtriranje podataka
✅ Brisanje podataka

## Struktura projekta

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js  # NextAuth konfiguracija
│   │   ├── movies/route.js              # API za filmove
│   │   └── music/route.js               # API za glazbu
│   ├── dashboard/page.js                # Dashboard nakon prijave
│   ├── layout.js                        # Root layout
│   └── page.js                          # Login stranica
├── components/
│   └── SessionProvider.js               # NextAuth SessionProvider
├── lib/
│   ├── mongodb.js                       # MongoDB connection
│   ├── themoviedb.js                    # TheMovieDB API helper
│   └── lastfm.js                        # Last.fm API helper
└── models/
    ├── User.js                          # User model
    ├── Movie.js                         # Movie model
    └── Track.js                         # Track model
```

