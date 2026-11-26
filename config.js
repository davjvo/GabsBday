/* ==========================================================
   EDIT THIS FILE to fill in the party details.
   Everything marked PLACEHOLDER shows on both the English
   and the Spanish page.
   ========================================================== */
window.SITE_CONFIG = {
  // Party start and end, in local time (YYYY-MM-DDTHH:MM). PLACEHOLDER
  start: "2027-01-16T19:00",
  end:   "2027-01-17T01:00",

  // Dress code. PLACEHOLDER
  dressCode: { en: "Garden party chic", es: "Garden party chic" },
  dressNote: { en: "Florals welcome", es: "Flores bienvenidas" },

  // Venue. PLACEHOLDER
  venueName: "Venue name",
  address: "Street 123, City",
  // What to search on the map (venue name + address works best).
  mapQuery: "Central Park, New York",

  // RSVP deadline (YYYY-MM-DD). PLACEHOLDER
  rsvpBy: "2027-01-05",

  // Paste the Apps Script web app URL here after setup (see SETUP.md).
  // While it is empty the site runs in demo mode: forms save only in
  // this browser, so you can try everything before setting up Sheets.
  endpoint: "",

  // Gift list. Put photos in assets/img/ and use their file names.
  // Set "url" to the store link. PLACEHOLDER
  gifts: [
    { id: "gift-1", name: { en: "Gift one", es: "Regalo uno" }, img: "assets/img/gift-1.jpg", url: "#" },
    { id: "gift-2", name: { en: "Gift two", es: "Regalo dos" }, img: "assets/img/gift-2.jpg", url: "#" },
    { id: "gift-3", name: { en: "Gift three", es: "Regalo tres" }, img: "assets/img/gift-3.jpg", url: "#" }
  ],
  // Lets a guest mark a gift as "I'll get this" so nobody buys it twice.
  giftReservations: true,

  // Song that plays after the guest taps "Open invitation".
  song: "assets/audio/song.mp3"
};
