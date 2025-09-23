// js/main.js — no persistence, auto-reset after short delay

document.addEventListener('DOMContentLoaded', () => {
  // Render latest 3 posts on homepage (thumbs with temporary acknowledgement)
  const latest = document.getElementById('latest-posts');
  if (latest) {
    fetch('posts/feed.json', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          latest.innerHTML =
            '<p>Advice is on the way — new tips will appear here soon.</p>';
          return;
        }

        const html = items.slice(0, 3).map(p => {
          return `
            <article class="card">
              <h3 style="margin-top:0">${p.title || ''}</h3>
              ${p.date ? `<small>${p.date}</small>` : ''}
              <p>${p.excerpt || ''}</p>
              <div class="feedback">
                <button class="thumb-up" aria-label="This advice was helpful">👍</button>
                <button class="thumb-down" aria-label="This advice was not helpful">👎</button>
                <small class="thanks" style="display:none">Thanks for your feedback!</small>
              </div>
            </article>
          `;
        }).join('');

        latest.innerHTML = html;

        // Attach handlers — no persistence, short temporary "thanks"
        latest.querySelectorAll('.feedback').forEach(box => {
          const up = box.querySelector('.thumb-up');
          const down = box.querySelector('.thumb-down');
          const thanks = box.querySelector('.thanks');

          const showThanksTemporarily = () => {
            // disable both buttons briefly
            up.disabled = true;
            down.disabled = true;
            thanks.style.display = 'inline';

            // after 1.5s reset to original state
            setTimeout(() => {
              thanks.style.display = 'none';
              up.disabled = false;
              down.disabled = false;
            }, 1500);
          };

          up.addEventListener('click', showThanksTemporarily);
          down.addEventListener('click', showThanksTemporarily);
        });
      })
      .catch(() => {
        latest.innerHTML =
          '<p>Advice is on the way — new tips will appear here soon.</p>';
      });
  }

  // Render full blog list (unchanged, no read-more)
  const list = document.getElementById('blog-list');
  if (list) {
    fetch('posts/feed.json', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          list.innerHTML =
            '<div class="card"><p>We’re preparing fresh advice. Please check back tomorrow.</p></div>';
          return;
        }
        list.innerHTML = items
          .map(
            p => `
          <article class="card" style="margin-bottom:14px">
            <h2 style="margin:0 0 6px">${p.title || ''}</h2>
            <small>${p.date || ''}</small>
            <p>${p.excerpt || ''}</p>
          </article>
        `
          )
          .join('');
      })
      .catch(() => {
        list.innerHTML =
          '<div class="card"><p>We’re preparing fresh advice. Please check back tomorrow.</p></div>';
      });
  }
});
