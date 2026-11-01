const $ = selector => document.querySelector(selector);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.documentElement.classList.add('js-motion');
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
let toastTimer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}
async function copy(value, label) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    toast(`${label}를 복사했습니다.`);
  } catch {
    const dialog = $('#copy-dialog');
    $('#copy-title').textContent = label;
    const input = dialog.querySelector('input');
    input.value = value;
    input.setAttribute('aria-label', label);
    dialog.showModal(); input.focus(); input.select();
  }
}
const shareUrl = () => new URL('./', location.href).href;
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy, button.dataset.label)));
$('#close-copy').addEventListener('click', () => $('#copy-dialog').close());
$('#copy-link').addEventListener('click', () => copy(shareUrl(), '초대장 링크'));
$('#share').addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: '지훈 · 지형의 신랑 측 피로연에 초대합니다', text: '2026년 12월 3일 목요일 오후 4시~7시\n부안 내츄럴팜 · 변산로 2427', url: shareUrl() });
      return;
    } catch (error) { if (error.name === 'AbortError') return; }
  }
  await copy(shareUrl(), '초대장 링크');
});
const photos = [...document.querySelectorAll('.gallery-item')];
const photoDialog = $('#photo-dialog');
const fullPhoto = $('.photo-full');
let photoIndex = 0;
let photoTrigger;
let savedScroll = 0;
let touchStart = null;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const item = photos[photoIndex];
  fullPhoto.hidden = false;
  $('.photo-error').hidden = true;
  fullPhoto.src = item.href;
  fullPhoto.alt = item.querySelector('img').alt;
  $('.photo-original').href = item.href;
  $('.photo-counter').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
}
photos.forEach((item, index) => item.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || !photoDialog.showModal) return;
  event.preventDefault();
  photoTrigger = item;
  savedScroll = scrollY;
  showPhoto(index);
  photoDialog.showModal();
  document.body.style.top = `-${savedScroll}px`;
  document.body.classList.add('photo-open');
}));
fullPhoto.addEventListener('error', () => { fullPhoto.hidden = true; $('.photo-error').hidden = false; });
$('.photo-close').addEventListener('click', () => photoDialog.close());
$('.photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
$('.photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
photoDialog.addEventListener('close', () => {
  document.body.classList.remove('photo-open'); document.body.style.top = '';
  scrollTo({ top: savedScroll, behavior: 'instant' });
  photoTrigger?.focus({ preventScroll: true }); touchStart = null;
  fullPhoto.removeAttribute('src');
});
$('.photo-stage').addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
$('.photo-stage').addEventListener('touchend', event => {
  if (!touchStart || event.touches.length) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
$('.photo-stage').addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
