document.addEventListener('DOMContentLoaded', () => {
  // Render latest 3 posts on homepage
  const latest = document.getElementById('latest-posts');
  if (latest) {
    fetch('posts/feed.json', {cache:'no-store'})
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        if (!Array.isArray(items) || items.length === 0) {
          latest.innerHTML = '<p>Advice is on the way — new tips will appear here soon.</p>';
          return;
        }
        const html = items.slice(0,3).map(p => `
          <article class="card">
            <h3 style="margin-top:0">${p.title}</h3>
            <p>${p.excerpt}</p>
            <a class="btn ghost" href="${p.url || 'blog.html'}">Read more</a>
          </article>
        `).join('');
        latest.innerHTML = html;
      })
      .catch(() => latest.innerHTML = '<p>Advice is on the way — new tips will appear here soon.</p>');
  }

  // Render full blog list
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
            <p>${p.excerpt}</p>
            ${p.url ? `<a class="btn" href="${p.url}">Read</a>` : ''}
          </article>
        `).join('');
      })
      .catch(() => list.innerHTML = '<div class="card"><p>We’re preparing fresh advice. Please check back tomorrow.</p></div>');
  }
});
