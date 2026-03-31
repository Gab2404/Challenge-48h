// Transition fondu entre deux écrans
export function goToScreen(from, to) {
  from.classList.add('fade-out');
  setTimeout(() => {
    from.classList.remove('active', 'fade-out');
    to.classList.add('active');
  }, 600);
}
