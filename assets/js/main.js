// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

// Demo quote form: validates input but does NOT send anything.
// To send real messages, see "Making the form work in production" in README.md.
const form = document.getElementById('quote-form');
const status = document.getElementById('form-status');

const rules = [
  { id: 'name', message: 'Please enter your full name.', valid: (v) => v.trim().length > 1 },
  { id: 'email', message: 'Please enter a valid email address.', valid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { id: 'service', message: 'Please choose a service.', valid: (v) => v !== '' },
];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = '';
  status.classList.remove('is-success');
  let firstInvalid = null;

  rules.forEach((rule) => {
    const field = document.getElementById(rule.id);
    const error = document.getElementById(`${rule.id}-error`);
    const ok = rule.valid(field.value);
    field.setAttribute('aria-invalid', String(!ok));
    if (ok) {
      field.removeAttribute('aria-describedby');
    } else {
      field.setAttribute('aria-describedby', error.id);
      firstInvalid = firstInvalid || field;
    }
    error.textContent = ok ? '' : rule.message;
    error.hidden = ok;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  status.classList.add('is-success');
  status.textContent = 'Demo only: your details look valid, but nothing was sent because this form is not connected to a server.';
  form.reset();
});
