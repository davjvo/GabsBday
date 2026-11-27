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
        "title": "Gabs' birthday", "description": "You're invited to celebrate Gabs' birthday.",
        "splashTitle": "You're invited", "splashText": "Turn your sound on for the full experience.",
        "splashButton": "Open invitation", "splashSilent": "Enter without music",
        "navLabel": "Sections", "navDetails": "Details", "navLocation": "Location", "navGifts": "Gifts", "navWall": "Notes",
        "musicLabel": "Play or pause music",
        "heroKicker": "Join us to celebrate", "heroButton": "RSVP", "scrollLabel": "Scroll down",
        "phDate": "Date to be announced", "phTime": "Time TBA",
        "phVenue": "Venue name", "phAddress": "Address to be announced",
        "tagline": "A night of music, stars and the people she loves most",
        "detailsTitle": "the details", "detailsEyebrow": "save the date",
        "cardDate": "Date", "cardTime": "Arrival", "untilWord": "until",
        "addCal": "Add to calendar",
        "countdownTitle": "the countdown is on", "countdownButton": "Confirm attendance",
        "locationEyebrow": "where", "mapTitle": "Map to the party",
        "giftsTitle": "wish list", "giftsEyebrow": "a few ideas, if you'd like",
        "giftsText": "Your company is the best gift. If you'd still like to bring something, her wish list has a few ideas.",
        "giftsButton": "Open the wish list",
        "rsvpEyebrow": "please reply by",
        "fName": "Your name", "fAttending": "Will you come?", "yes": "Yes, I'll be there", "no": "Sadly, no",
        "fGuests": "How many people with you?", "fNote": "Anything we should know?",
        "fNotePh": "Allergies, song you love, a hello…", "rsvpButton": "Send RSVP",
        "rsvpThanksTitle": "thank you!", "rsvpThanksText": "Your answer is saved. See you soon!",
        "songsTitle": "request a song", "songsEyebrow": "one per guest, so choose wisely",
        "fSong": "Song", "fArtist": "Artist", "songButton": "Add to playlist",
        "songThanks": "Your song is on the list. See you on the dance floor!",
        "songListLabel": "Requested songs",
        "wallTitle": "leave a little note", "wallEyebrow": "for the birthday girl",
        "fMessage": "Your message", "fMessagePh": "Write something sweet…", "wallButton": "Pin it to the wall",
        "footerLove": "Made with love by Jose",
    },
    "es": {
        "lang": "es", "root": "../", "altHref": "../", "altLang": "en", "altLabel": "English version", "altShort": "EN",
        "title": "Cumpleaños de Gabs", "description": "Estás invitado a celebrar el cumpleaños de Gabs.",
        "splashTitle": "Estás invitado", "splashText": "Sube el volumen para vivirlo completo.",
        "splashButton": "Abrir invitación", "splashSilent": "Entrar sin música",
        "navLabel": "Secciones", "navDetails": "Detalles", "navLocation": "Ubicación", "navGifts": "Regalos", "navWall": "Mensajitos",
        "musicLabel": "Reproducir o pausar la música",
        "heroKicker": "Acompáñanos a celebrar", "heroButton": "Confirmar", "scrollLabel": "Bajar",
        "phDate": "Fecha por anunciar", "phTime": "Hora por anunciar",
        "phVenue": "Nombre del lugar", "phAddress": "Dirección por anunciar",
        "tagline": "Una noche de música, estrellas y la gente que más quiere",
        "detailsTitle": "los detalles", "detailsEyebrow": "aparta la fecha",
        "cardDate": "Fecha", "cardTime": "Llegada", "untilWord": "hasta las",
        "addCal": "Añadir al calendario",
        "countdownTitle": "ya empezó la cuenta regresiva", "countdownButton": "Confirmar asistencia",
        "locationEyebrow": "dónde", "mapTitle": "Mapa de la fiesta",
        "giftsTitle": "lista de regalos", "giftsEyebrow": "algunas ideas, si quieres",
        "giftsText": "Tu compañía es el mejor regalo. Si aun así quieres traer algo, en su lista hay algunas ideas.",
        "giftsButton": "Ver la lista de regalos",
        "rsvpEyebrow": "confirma antes del",
        "fName": "Tu nombre", "fAttending": "¿Vienes?", "yes": "¡Sí, ahí estaré!", "no": "No podré",
        "fGuests": "¿Cuántas personas te acompañan?", "fNote": "¿Algo que debamos saber?",
        "fNotePh": "Alergias, una canción que te encanta, un saludo…", "rsvpButton": "Enviar respuesta",
        "rsvpThanksTitle": "¡gracias!", "rsvpThanksText": "Tu respuesta quedó guardada. ¡Nos vemos pronto!",
        "songsTitle": "pide tu canción", "songsEyebrow": "solo una por persona, elige bien",
        "fSong": "Canción", "fArtist": "Artista", "songButton": "Agregar a la playlist",
        "songThanks": "Tu canción ya está en la lista. ¡Nos vemos en la pista!",
        "songListLabel": "Canciones pedidas",
        "wallTitle": "déjale un mensajito", "wallEyebrow": "para la cumpleañera",
        "fMessage": "Tu mensaje", "fMessagePh": "Escribe algo bonito…", "wallButton": "Pegar en el muro",
        "footerLove": "Hecho con amor por Jose",
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
