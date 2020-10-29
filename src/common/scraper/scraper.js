const scraper = ((window, document) => {
  return {
    a: (posts) => alert(posts),
  }
})(window, document);

window.scraper = scraper;