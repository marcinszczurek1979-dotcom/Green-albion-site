document.addEventListener('DOMContentLoaded', () => {
  // Render latest 3 posts on homepage (no "Read more"; with thumbs feedback)
  const latest = document.getElementById('latest-posts');
  if (latest) {
    fetch('posts/feed.json', {cache:'no-store'})
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          latest.innerHTML = '<p>Advice is on the way — new tips will appear here soon.</p>';
          return;
        }
        const html = items.slice(0,3).map(p => {
          const id = (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || String(Date.now());
          return `
            <article class="card">
              <h3 style="margin-top:0">${p.title}</h3>
              ${p.date ? `<small>${p.date}</small>` : ''}
              <p>${p.excerpt || ''}</p>
              <div class="feedback" data-id="${id}">
                <button class="thumb-up" aria-label="This advice was helpful">👍</button>
                <button class="thumb-down" aria-label="This advice was not helpful">👎</button>
                <small class="thanks">Thanks for your feedback!</small>
              </div>
            </article>
          `;
        }).join('');
        latest.innerHTML = html;

        // Attach handlers + localStorage memory
        latest.querySelectorAll('.feedback').forEach(box => {
          const id = box.getAttribute('data-id');
          const up = box.querySelector('.thumb-up');
          const down = box.querySelector('.thumb-down');
          const thanks = box.querySelector('.thanks');

          const saved = localStorage.getItem('ga_feedback_' + id);
          if (saved) {
            up.disabled = true; down.disabled = true;
            thanks.style.display = 'inline';
          }

          const choose = (val) => {
            localStorage.setItem('ga_feedback_' + id, val);
            up.disabled = true; down.disabled = true;
            thanks.style.display = 'inline';
          };

          up.addEventListener('click', () => choose('up'));
          down.addEventListener('click', () => choose('down'));
        });
      })
      .catch(() => latest.innerHTML = '<p>Advice is on the way — new tips will appear here soon.</p>');
  }

  // Render full blog list (kept as is; optional)
  const list = document.getElementById('blog-list');
  if (list) {
    fetch('posts/feed.json', {cache:'no-store'})
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          list.innerHTML = '<div class="card"><p>We’re preparing fresh advice. Please check back tomorrow.</p></div>';
          return;
        }
        list.innerHTML = items.map(p => `
          <article class="card" style="margin-bottom:14px">
            <h2 style="margin:0 0 6px">${p.title}</h2>
            <small>${p.date || ''}</small>
            <p>${p.excerpt || ''}</p>
          </article>
        `).join('');
      })
      .catch(() => list.innerHTML = '<div class="card"><p>We’re preparing fresh advice. Please check back tomorrow.</p></div>');
  }
});
