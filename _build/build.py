"""Builds index.html (English) and es/index.html (Spanish) from template.html.

Edit the text below, then run from the gabs-site folder:
    python3 _build/build.py
Party details (date, time, address, gifts) live in config.js, not here.
"""
import pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent

TEXT = {
    "en": {
        "lang": "en", "root": "", "altHref": "es/", "altLang": "es", "altLabel": "Versión en español", "altShort": "ES",
        "title": "Gabs' birthday", "description": "Join us for a night under the stars to celebrate Gabs.",
        "splashTitle": "You're invited", "splashText": "Turn up the volume. This invitation comes with a soundtrack.",
        "splashButton": "Open the invitation", "splashSilent": "Enter without music",
        "navLabel": "Sections", "navDetails": "Details", "navLocation": "Location", "navGifts": "Gifts", "navWall": "Notes",
        "musicLabel": "Play or pause music",
        "heroKicker": "You're invited to celebrate", "heroButton": "RSVP", "scrollLabel": "Scroll down",
        "phDate": "Date to be announced", "phTime": "Time TBA",
        "phVenue": "Venue name", "phAddress": "Address to be announced",
        "tagline": "A night under the stars, with good music, great food and the people she loves most",
        "detailsTitle": "the details", "detailsEyebrow": "save the date",
        "cardDate": "Date", "cardTime": "Arrival", "untilWord": "until",
        "addCal": "Add to my calendar",
        "countdownTitle": "the countdown is on", "countdownButton": "Count me in",
        "locationEyebrow": "where we'll be", "mapTitle": "Map to the party",
        "giftsTitle": "wish list", "giftsEyebrow": "only if you'd like",
        "giftsText": "Having you there is the best gift of all. But if you'd like to bring a little something, here are a few things she's been dreaming of.",
        "giftsButton": "See her wish list",
        "rsvpEyebrow": "kindly reply by",
        "fName": "Your name", "fAttending": "Will you join us?", "yes": "Yes, I'll be there!", "no": "Sadly, I can't make it",
        "fGuests": "How many people are coming with you?", "fNote": "Anything we should know?",
        "fNotePh": "Allergies, a favorite song, or just a hello…", "rsvpButton": "Send my RSVP",
        "rsvpThanksTitle": "thank you!", "rsvpThanksText": "We got your answer. We can't wait to see you!",
        "songsTitle": "request a song", "songsEyebrow": "one per guest, so make it count",
        "fSong": "Song", "fArtist": "Artist", "songButton": "Add to the playlist",
        "songThanks": "Your song made the playlist. See you on the dance floor!",
        "songListLabel": "Requested songs",
        "wallTitle": "leave her a note", "wallEyebrow": "for the birthday girl",
        "fMessage": "Your message", "fMessagePh": "Write something sweet…", "wallButton": "Pin it to the wall",
        "footerLove": "Made with love by Ksimerito",
    },
    "es": {
        "lang": "es", "root": "../", "altHref": "../", "altLang": "en", "altLabel": "English version", "altShort": "EN",
        "title": "Cumpleaños de Gabs", "description": "Acompáñanos a celebrar el cumpleaños de Gabs bajo las estrellas.",
        "splashTitle": "Tienes una invitación", "splashText": "Sube el volumen: esta invitación viene con banda sonora.",
        "splashButton": "Abrir la invitación", "splashSilent": "Entrar sin música",
        "navLabel": "Secciones", "navDetails": "Detalles", "navLocation": "Ubicación", "navGifts": "Regalos", "navWall": "Mensajitos",
        "musicLabel": "Reproducir o pausar la música",
        "heroKicker": "Te invitamos a celebrar", "heroButton": "Confirmar", "scrollLabel": "Bajar",
        "phDate": "Fecha por anunciar", "phTime": "Hora por anunciar",
        "phVenue": "Nombre del lugar", "phAddress": "Dirección por anunciar",
        "tagline": "Una noche bajo las estrellas, con buena música, buena comida y la gente que más quiere",
        "detailsTitle": "los detalles", "detailsEyebrow": "separa la fecha",
        "cardDate": "Fecha", "cardTime": "Llegada", "untilWord": "hasta las",
        "addCal": "Agregar a mi calendario",
        "countdownTitle": "ya empezó la cuenta regresiva", "countdownButton": "¡Cuenta conmigo!",
        "locationEyebrow": "dónde nos vemos", "mapTitle": "Mapa de la fiesta",
        "giftsTitle": "lista de deseos", "giftsEyebrow": "solo si quieres",
        "giftsText": "Tu presencia es el mejor regalo. Pero si quieres traerle un detallito, aquí tienes algunas cosas con las que sueña.",
        "giftsButton": "Ver su lista de deseos",
        "rsvpEyebrow": "confirma antes del",
        "fName": "Tu nombre", "fAttending": "¿Nos acompañas?", "yes": "¡Sí, ahí estaré!", "no": "Esta vez no podré",
        "fGuests": "¿Cuántas personas vienen contigo?", "fNote": "¿Algo que debamos saber?",
        "fNotePh": "Alergias, tu canción favorita o simplemente un saludo…", "rsvpButton": "Enviar mi respuesta",
        "rsvpThanksTitle": "¡gracias!", "rsvpThanksText": "Recibimos tu respuesta. ¡Te esperamos!",
        "songsTitle": "pide tu canción", "songsEyebrow": "solo una por persona, así que elige bien",
        "fSong": "Canción", "fArtist": "Artista", "songButton": "Agregar a la playlist",
        "songThanks": "Tu canción ya está en la playlist. ¡Nos vemos en la pista!",
        "songListLabel": "Canciones pedidas",
        "wallTitle": "déjale un mensajito", "wallEyebrow": "para la cumpleañera",
        "fMessage": "Tu mensaje", "fMessagePh": "Escribe algo bonito…", "wallButton": "Pegarlo en el muro",
        "footerLove": "Hecho con amor por Ksimerito",
    },
}

template = (HERE / "template.html").read_text(encoding="utf-8")
keys = set(re.findall(r"\{\{(\w+)\}\}", template))
for lang, t in TEXT.items():
    missing = keys - t.keys()
    if missing:
        raise SystemExit(f"{lang}: missing text for {sorted(missing)}")
    html = re.sub(r"\{\{(\w+)\}\}", lambda m: t[m.group(1)], template)
    out = SITE / ("index.html" if lang == "en" else "es/index.html")
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print("wrote", out.relative_to(SITE))
