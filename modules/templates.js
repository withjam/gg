export const result_list = {
  element: document.querySelector('.result-list'),
  fill: (items) => {
    result_list.element.innerHTML = items.join('');
  }
}

const currency_pattern = /(.)(?=(\d{3})+$)/g;
const currency = (value) => {
  return '$' + (''+value).replace(currency_pattern,'$1,');
}

export const result_item = {
  fill: (project) => {
    // simulate goal totals since full detail search is much slower
    const goal = project.id * 10;
    const progress = Math.random(1);
    const raised = parseInt(goal * progress);
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
      <section class="goal" aria-label="Raised ${currency(raised)} of ${currency(goal)}">
        <label><strong>${currency(raised)}</strong> raised of ${currency(goal)} goal</label>
        <div class="progress"><span class="amount" style="width:${parseInt(progress*100)}%"></span></div>
      </section>
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