(() => {
  "use strict";
  const config = window.WEDDING_CONFIG || {};
  const zone = config.timezone || "Asia/Kolkata";
  const $ = (id) => document.getElementById(id);
  const dateParts = (date) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  };
  const localDateKey = (date) => {
    const p = dateParts(date);
    return `${p.year}-${p.month}-${p.day}`;
  };
  const startTimestamp = (event) => new Date(`${event.date}T${event.time || "18:00"}:00+05:30`).getTime();
  const niceDate = (dateKey) => new Intl.DateTimeFormat("en-IN", {
    timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date(`${dateKey}T12:00:00+05:30`));

  function updateCountdown() {
    const now = new Date();
    const today = localDateKey(now);
    const events = [...(config.events || [])].sort((a,b) => a.date.localeCompare(b.date));
    const current = events.find(e => e.date === today);
    const next = events.find(e => e.date > today);
    const beforeFirst = !current && !events.some(e => e.date < today);
    const title = $("active-event-title");
    const kicker = $("event-kicker");
    const countdown = $("countdown");
    const banner = $("active-banner");
    const caption = $("countdown-caption");

    if (current) {
      title.textContent = `${current.title} day`;
      kicker.textContent = "TODAY, WE CELEBRATE";
      countdown.hidden = true;
      banner.hidden = false;
      $("active-banner-text").textContent = `Today is ${current.title.toLowerCase()} — ${niceDate(current.date)}.`;
      caption.textContent = current.venue || "Wishing you a beautiful celebration.";
      return;
    }
    if (!next) {
      title.textContent = "Thank you for celebrating with us";
      kicker.textContent = "OUR THREE DAYS TOGETHER";
      countdown.hidden = true;
      banner.hidden = false;
      $("active-banner-text").textContent = "The celebrations have ended, but the memories stay with us.";
      caption.textContent = "With love, Soumyadeep & Rica";
      return;
    }

    countdown.hidden = false;
    banner.hidden = true;
    const target = startTimestamp(next);
    const diff = Math.max(0, target - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
    title.textContent = beforeFirst ? "Until we say “I do”" : `Next up: ${next.title}`;
    kicker.textContent = beforeFirst ? "THE CELEBRATION BEGINS IN" : "THE NEXT CELEBRATION BEGINS IN";
    caption.textContent = `${next.title} · ${niceDate(next.date)}`;
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  document.querySelectorAll(".rsvp-event").forEach(button => {
    button.addEventListener("click", () => {
      const input = document.querySelector(`input[name="events"][value="${button.dataset.event}"]`);
      if (input) input.checked = true;
      $("rsvp").scrollIntoView({ behavior: "smooth" });
    });
  });

  function setStatus(el, message, type) {
    el.textContent = message;
    el.className = `form-status ${type || ""}`.trim();
  }
  function requireEndpoint() {
    const endpoint = (config.appsScriptUrl || "").trim();
    if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\//.test(endpoint)) {
      throw new Error("The Google Apps Script endpoint is not configured yet. Follow SETUP.md, then add the web-app URL to config.js.");
    }
    return endpoint;
  }
  async function sendToAppsScript(payload) {
    const endpoint = requireEndpoint();
    // text/plain is a CORS-safelisted content type. The Apps Script response is
    // opaque in no-cors mode, so we can confirm the request was sent, not verify
    // the backend's result from the browser. Check the Sheet/Drive after setup.
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload)
    });
  }

  $("rsvp-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $("rsvp-status");
    const selectedEvents = [...form.querySelectorAll('input[name="events"]:checked')].map(el => el.value);
    $("events-error").hidden = selectedEvents.length > 0;
    if (!selectedEvents.length) {
      setStatus(status, "Please choose at least one celebration.", "error");
      return;
    }
    if (form.elements.website.value) return; // basic bot honeypot
    const endpoint = (config.appsScriptUrl || "").trim();
    if (!endpoint) {
      setStatus(status, "Almost ready: connect Google Sheets by following SETUP.md and adding your Apps Script URL to config.js.", "error");
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.querySelector("span").textContent = "Sending…";
    const data = Object.fromEntries(new FormData(form).entries());
    data.events = selectedEvents;
    data.guestCount = Number(data.guestCount || 1);
    data.submittedAt = new Date().toISOString();
    data.type = "rsvp";
    try {
      await sendToAppsScript(data);
      form.reset();
      setStatus(status, "Your RSVP was sent. Thank you! The hosts can verify it in their Google Sheet.", "success");
    } catch (error) {
      setStatus(status, error.message || "We couldn't send your response. Please try again.", "error");
    } finally {
      submit.disabled = false;
      submit.querySelector("span").textContent = "Send my RSVP";
    }
  });

})();
