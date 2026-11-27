# Gabs' birthday site: setup

The site is plain HTML, CSS and JavaScript. The only outside things it loads are
Google Fonts (Fraunces and DM Sans) and the Google Maps embed.

```
index.html        English page (site root)
es/index.html     Spanish page (/es)
styles.css        palette, layout, scroll animations
main.js           splash, music, countdown, forms, wish list link, wall
config.js         <- party details: date, time, venue, wish list URL, Sheets URL
apps-script/      Google Sheets backend (Code.gs)
assets/img/       photos
assets/audio/     song
_build/           page text in both languages + the script that writes the two pages
```

## 1. Fill in the details

Open `config.js` and replace the placeholders: date and arrival time, optional
end time, venue name and address, map search text (`mapQuery`, which turns on the
embedded map and the Waze button), the Google Maps link (`mapsUrl`), RSVP
deadline, the wish list link (`wishlistUrl`) and the song (`youtubeId`). Both pages
read from this one file, so dates and times show in the right language
automatically.

## 2. Add your photos and song

Put these files in place (same names), and they replace the painted placeholders:

| File | Where it shows | Tip |
| --- | --- | --- |
| `assets/img/hero.jpg` | Portada (full screen) | Landscape, about 2000px wide, under 500 KB |
| `assets/img/venue.jpg` | Location section | Landscape |
| `assets/audio/song.mp3` | Only if `youtubeId` is empty: plays after "Open invitation" | MP3 under 5 MB |

The song normally streams from YouTube (`youtubeId` in `config.js`). Browsers only
allow sound after a tap, which is why the page opens with the "Open invitation"
screen. On some phones YouTube may still refuse to start; guests can then tap the
music button in the corner.

## 3. Change the page text (optional)

The tagline and every label live in `_build/build.py`,
English and Spanish side by side. Edit there, then run from this folder:

```
python3 _build/build.py
```

It rewrites `index.html` and `es/index.html`. The text marked with a dashed
outline on the page is placeholder copy; remove `class="ph"` in
`_build/template.html` once you replace it.

## 4. Connect Google Sheets (about 10 minutes)

Until this is done the site runs in demo mode: forms work, but answers are
saved only in your own browser.

1. Create a new Google Sheet, for example "Gabs birthday".
2. Click **Extensions > Apps Script**. Delete what's there, paste all of
   `apps-script/Code.gs`, and save.
3. Click **Deploy > New deployment**. Choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions it asks for, and copy the
   **Web app URL** (ends in `/exec`).
5. Paste it into `config.js` as `endpoint: "https://script.google.com/macros/s/.../exec"`.

The tabs RSVP, Notes and Songs appear the first time someone sends
something. RSVP answers stay private in the Sheet; the site never shows them.

The Sheet lives in your Google Drive. To get an Excel file at any time:
**File > Download > Microsoft Excel (.xlsx)**.

If you edit `Code.gs` later: **Deploy > Manage deployments > Edit > Version: New version**,
so the same URL keeps working.

### Moderating the wall

To approve notes before they show, set `MODERATE_NOTES = true` at the top of
`Code.gs` and redeploy. New notes then arrive with `approved` = FALSE; type
TRUE to show one. To hide a note any time, set its `approved` cell to FALSE.

### One song per person

By default the Sheet refuses a second song from the same name, and the browser
remembers the guest already asked. For a stricter rule, give each guest a
personal link such as `https://yoursite/?g=ana-k7` (or `/es/?g=ana-k7`). The
code is then used instead of the name, and it's also saved with their RSVP.

## 5. Turn on the captcha (reCAPTCHA)

Every form (RSVP, song, note) gets an "I'm not a robot" checkbox, checked again
by the Apps Script, so nobody can spam resubmissions.

1. Go to https://www.google.com/recaptcha/admin/create.
2. Type: **reCAPTCHA v2 > "I'm not a robot" Checkbox**.
   Domains: `davjvo.github.io` (add `localhost` to test locally).
3. You get two keys:
   - **Site key**: paste it into `config.js` as `recaptchaSiteKey`.
   - **Secret key**: in Apps Script open **Project Settings > Script Properties >
     Add script property**, name `RECAPTCHA_SECRET`, value = the secret key.
     Never put the secret key in `config.js` or anywhere on the site.
4. Redeploy the Apps Script (**Deploy > Manage deployments > Edit > New version**).

While `recaptchaSiteKey` is empty, no checkbox shows. While `RECAPTCHA_SECRET`
is missing, the Apps Script accepts forms without checking.

## 6. Publish

GitHub Pages: create a repository, upload everything in this folder (except
`_build` if you like), then **Settings > Pages > Deploy from branch > main**.
The English page is at the root and the Spanish one at `/es/`.

Netlify works too: drag this folder onto https://app.netlify.com/drop.

To preview locally, run `python3 -m http.server` in this folder and open
http://localhost:8000.
