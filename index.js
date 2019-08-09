import { search, fetch_themes } from './modules/search';
import { result_item, result_list, theme_list } from './modules/templates';

// start off with a blank search
const updateSearch = () => {
  const q = GG.getSearchQ();
  const options = {
    filters: GG.getCurrentFilters()
  }
  search(q, options).then(results => result_list.fill(results.projects.map(result => result_item.fill(result))));
}

window.GG = {
  changeView: (btn) => {
    document.querySelector('.result-list').setAttribute('data-view', btn.value);
    document.querySelector('.view-options .toggle.active').classList.remove('active');
    btn.classList.add('active');
  },
  getSearchQ: () => {
    return document.querySelector('#search_q').value
  },
  getCurrentFilters: () => {
    const filters = document.querySelectorAll('input.search_filter_item:checked');
    return [].map.call(filters, inp => inp.name + ':' + inp.value);
  },
  doSearch: () => {
    updateSearch();
  },
  updateFilters: () => {
    updateSearch();
  },
  clearSearch: () => {
    // clear query
    document.querySelector('#search_q').value = '';
    // uncheck any filters
    [].forEach.call(document.querySelectorAll('input.search_filter_item:checked'), ele => ele.checked = false);
    updateSearch();
  }
}

// initialize the list of themes
fetch_themes().then(theme_list.fill);
// launch a search on page load
updateSearch();