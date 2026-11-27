/* ==========================================================
   EDIT THIS FILE to fill in the party details.
   Everything marked PLACEHOLDER shows on both the English
   and the Spanish page.
   ========================================================== */
window.SITE_CONFIG = {
  // Party start (guest arrival), in local time (YYYY-MM-DDTHH:MM).
  // Friday, January 15, 2027, arrival at 8:30 PM.
  start: "2027-01-15T20:30",
  // Optional end time. Leave "" to hide it (calendar uses 4 hours).
  end: "",

  // Dress code: link to the reference look, plus an optional short line
  // under it (leave "" to show only the link).
  dressCodeUrl: "https://www.pinterest.com/gabbyp0521/gabs-28th-bday-bash-the-art-of-getting-old/?invite_code=5bd5f6dcc5c54c289d0d2ab80975c1d4&sender=848013942243695969",
  dressCode: { en: "", es: "" },

  // Venue.
  venueName: "EcoCafeRD",
  address: "C. Teodoro Chasseriau 72, Santo Domingo",
  // The Google Maps link to the venue (used by the Google Maps button).
  mapsUrl: "https://maps.app.goo.gl/XCZzVPmzWZvyFz377",
  // Text to search for the embedded map and Waze (venue name + address
  // works best). Leave "" to hide the embedded map and the Waze button.
  mapQuery: "EcoCafeRD, C. Teodoro Chasseriau 72, Santo Domingo",

  // RSVP deadline (YYYY-MM-DD). PLACEHOLDER
  rsvpBy: "2027-01-05",

  // Paste the Apps Script web app URL here after setup (see SETUP.md).
  // While it is empty the site runs in demo mode: forms save only in
  // this browser, so you can try everything before setting up Sheets.
  endpoint: "",

  // Link to the external wish list.
  wishlistUrl: "https://www.elfster.com/w/gabbyp-vvdkbx/gabby-p-s-wish-list",

  // Song that plays after the guest taps "Open invitation".
  // YouTube video id (the part after youtu.be/ or watch?v=). It streams
  // from YouTube in a hidden player. Leave "" to use the MP3 below instead.
  youtubeId: "1IvyGfWhoWo",
  youtubeStart: 0, // start at this second
  song: "assets/audio/song.mp3",

  // Google reCAPTCHA v2 ("I'm not a robot" checkbox) site key.
  // Leave "" to turn the captcha off. See SETUP.md, step 5.
  recaptchaSiteKey: ""
};
