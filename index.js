import { search, fetch_themes } from './modules/search.js';
import { result_item, result_list, theme_list } from './modules/templates.js';
import { load_map, add_markers, clear_markers} from './modules/map.js';

// start off with a blank search
const updateSearch = () => {
  const q = GG.getSearchQ();
  const options = {
    filters: GG.getCurrentFilters()
  }
  clear_markers();
  search(q, options).then(results => {
    document.getElementById('search_total').innerHTML = results.numberFound + ' result' + (results.numberFound === 1 ? '' : 's');
    result_list.fill(results.projects.map(result => result_item.fill(result)));
    add_markers(results.projects);
  });
}

window.GG = {
  changeView: (btn) => {
    document.querySelector('.search-results').setAttribute('data-view', btn.value);
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
  },
  map: 0
}

/**
 * Do the needful at page load
 */
// initialize the list of themes
fetch_themes().then(theme_list.fill);
// launch a search on page load
updateSearch();
// load the map
GG.map = load_map();