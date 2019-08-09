const API_KEY = '5da21f46-d3f8-4ee8-8bc1-63ba5f7de11f';

const fetchJSON = (url, method) => {
  // add the API key to the url
  url = (url.indexOf('?') > 1) ? url + '&' : url + '?';
  url += 'api_key=' + API_KEY;
  return fetch(url, {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
}

export const search = (query, options={}) => {
  const qstring = query || '*';
  const start = options.start || 0;
  const filters = (options.filters && options.filters.length) ? '&filter=' + options.filters.join(',') : '';
  return Promise.all([
    fetchJSON('https://api.globalgiving.org/api/public/services/search/projects/summary?start=' + start + '&q=' + qstring + filters),
    fetchJSON('https://api.globalgiving.org/api/public/services/search/projects/summary?start=' + (start + 10) + '&q=' + qstring + filters),
    fetchJSON('https://api.globalgiving.org/api/public/services/search/projects/summary?start=' + (start + 20) + '&q=' + qstring + filters),
    fetchJSON('https://api.globalgiving.org/api/public/services/search/projects/summary?start=' + (start + 30) + '&q=' + qstring + filters),
    fetchJSON('https://api.globalgiving.org/api/public/services/search/projects/summary?start=' + (start + 40) + '&q=' + qstring + filters),
  ]).then(responses => {
    // join all responses
    return Promise.all(responses.map(response => response.json()))
  }).then(responses => {
    console.log('responses', responses);
    const response = {
      numberFound: responses[0].search.response.numberFound,
      projects: responses.flatMap(response => response.search.response.projects ? response.search.response.projects.project : [])
    }
    console.log('got result', response);
    return response;
  });
}

export const fetch_themes = () => (
  fetchJSON('https://api.globalgiving.org/api/public/projectservice/themes')
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw 'bad response';
    })
    .then(response => (response.themes.theme))
    .catch(ex => {
      console.log(ex);
    })
);