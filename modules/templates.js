export const result_list = {
  element: document.querySelector('.result-list'),
  fill: (items) => {
    result_list.element.innerHTML = items.join('');
  }
}

export const result_item = {
  fill: (project) => {
    return `<article class="result-item">
    <section class="thumbnail"><img class="thumb" src="${project.imageLink.replace('.jpg', '_featured.jpg')}" alt="Project Thumbnail Image"></section>
    <section class="details">
      <header>
        <div class="label theme" aria-label="Project Theme">${project.themeName}</div>
        <div class="label country" aria-label="Project Country">${project.country}</div>
        <h1 class="title" aria-label="Project Title">${project.title}</h1>
        <h2 class="organization">${project.organization.name}</h2>
      </header>
      <p class="summary">${project.summary}</p>
    </section>
  </article>`;
  }
}

export const theme_list = {
  element: document.getElementById('theme_filters'),
  fill: (data) => {
    console.log('fill theme list', data);
    theme_list.element.innerHTML = '';
    data.forEach(item => {
      const lbl = document.createElement('label');
      const inp = document.createElement('input');
      const span = document.createElement('span');
      inp.setAttribute('type','checkbox');
      inp.setAttribute('name','theme');
      inp.className = 'search_filter_item';
      inp.onclick = GG.updateFilters;
      inp.value = item.id;
      span.innerHTML = item.name;
      lbl.appendChild(inp);
      lbl.appendChild(span);
      theme_list.element.appendChild(lbl);
    })
  }
}