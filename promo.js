(() => {
  const announcement = document.getElementById('promo-announcement');
  const heading = document.getElementById('promo-heading');
  const description = document.getElementById('promo-description');
  const pause = document.getElementById('promo-pause');
  const messages = [
    {
      announcement: '🍂 The fall collection is here 🍁 Explore our first season.',
      heading: ['Fall', 'collection', 'is here.'],
      description: '🍂 Our first season. Explore the Fall Collection and find your next piece. 🍁'
    },
    {
      announcement: '⚠️ Warning: Website is still under construction. Stay tuned.',
      heading: ['Upcoming', 'streetwear', 'brand.'],
      description: '⚠️ Warning: Website is still under construction. Stay tuned.'
    }
  ];
  let current = 0;
  let paused = false;
  setInterval(() => {
    if (paused || document.hidden) return;
    const elements = [announcement, heading, description];
    elements.forEach(element => { element.classList.remove('promo-in'); element.classList.add('promo-out'); });
    setTimeout(() => {
    current = (current + 1) % messages.length;
    const message = messages[current];
    announcement.textContent = message.announcement;
    heading.replaceChildren(...message.heading.flatMap((line, index) =>
      index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]
    ));
    description.textContent = message.description;
    elements.forEach(element => { element.classList.remove('promo-out'); element.classList.add('promo-in'); });
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550);
  }, 7000);
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? 'Resume messages' : 'Pause messages';
    pause.setAttribute('aria-pressed', String(paused));
  });
})();
