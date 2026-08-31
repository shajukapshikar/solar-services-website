/* BUSINESS SETTINGS: change these values once to update the whole site. */
const BUSINESS = {
  name: 'Rayzen',
  whatsappNumber: '919637519308', // Country code + number only; no +, spaces or dashes.
  phoneDisplay: '+91 00000 00000',
  phoneLink: '+910000000000',
  email: 'hello@example.com',
  serviceArea: 'Your Service Area, India',
  defaultWhatsAppMessage: 'Hi, I would like to get a quote for solar panel cleaning/maintenance.'
};

document.title = `${BUSINESS.name} | Solar Panel Cleaning & Maintenance`;
document.querySelectorAll('[data-business]').forEach(el => el.textContent = BUSINESS.name);
document.querySelectorAll('[data-phone]').forEach(el => { el.textContent = BUSINESS.phoneDisplay; if (el.tagName === 'A') el.href = `tel:${BUSINESS.phoneLink}`; });
document.querySelectorAll('[data-email]').forEach(el => { el.textContent = BUSINESS.email; if (el.tagName === 'A') el.href = `mailto:${BUSINESS.email}`; });
document.querySelectorAll('[data-area]').forEach(el => el.textContent = BUSINESS.serviceArea);

function whatsappURL(message = BUSINESS.defaultWhatsAppMessage) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
  link.href = whatsappURL();
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
function closeMenu() {
  nav.classList.remove('is-open'); toggle.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation');
}
toggle.addEventListener('click', () => {
  const opening = !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', opening); toggle.classList.toggle('is-open', opening);
  toggle.setAttribute('aria-expanded', String(opening)); toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const serviceSelect = document.getElementById('service-required');
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const requested = link.dataset.service;
  const matching = [...serviceSelect.options].find(option => option.value === requested);
  serviceSelect.value = matching ? requested : (requested.includes('AMC') ? 'AMC Plan' : 'Other');
}));
document.querySelectorAll('[data-quote-link]').forEach(link => link.addEventListener('click', () => {
  if (!serviceSelect.value) serviceSelect.value = 'Other';
}));

const comparison = document.getElementById('comparison');
const compareRange = comparison.querySelector('.compare-range');
const before = comparison.querySelector('.comparison-before');
const handle = comparison.querySelector('.compare-handle');
function updateComparison(value) { before.style.width = `${value}%`; handle.style.left = `${value}%`; }
compareRange.addEventListener('input', e => updateComparison(e.target.value));
updateComparison(compareRange.value);

const form = document.getElementById('quote-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const required = [...form.querySelectorAll('[required]')];
  let valid = true;
  required.forEach(field => {
    const invalid = !field.value.trim() || !field.checkValidity();
    field.classList.toggle('invalid', invalid);
    if (invalid) valid = false;
  });
  if (!valid) {
    status.textContent = 'Please complete the required fields highlighted above.';
    status.className = 'form-status error';
    form.querySelector('.invalid').focus();
    return;
  }
  const data = new FormData(form);
  const rows = [
    `Hi, I would like to request a free quote from ${BUSINESS.name}.`, '',
    `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`,
    data.get('email') ? `Email: ${data.get('email')}` : '',
    `Location: ${data.get('location')}`, `Property type: ${data.get('property')}`,
    data.get('systemSize') ? `System size: ${data.get('systemSize')}` : '',
    `Service: ${data.get('service')}`, data.get('date') ? `Preferred date: ${data.get('date')}` : '',
    data.get('message') ? `Message: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');
  status.textContent = 'Your quote request is ready — opening WhatsApp…';
  status.className = 'form-status';
  window.open(whatsappURL(rows), '_blank', 'noopener');
});
form.querySelectorAll('input, select, textarea').forEach(field => field.addEventListener('input', () => field.classList.remove('invalid')));

// Keep the current section available to screen-reader and keyboard users through native anchor navigation.
