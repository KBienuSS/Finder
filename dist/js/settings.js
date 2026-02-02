export const select = {
  containerOf: {
    finder: '.finder-wrapper',
    summary: '.summary-wrapper',
  },
  templateOf: {
    finder:'#template-finder-widget',
    summary:'#template-summary',
  },
  finder: {
    table: '.finder-table',
    button: '.table-button',
    choosedSpot: 'choose-spot',
    unavailable: 'unavailable',
    startColor: 'start-spot',
    finishColor: 'stop-spot',
    summaryActive: 'summary-active',
  },
  summary: {
    mainDiv: '.summary',
    summaryContainer: '.summary-container',
  }
};

export const templates = {
  finder: Handlebars.compile(document.querySelector(select.templateOf.finder).innerHTML),
  summary: Handlebars.compile(document.querySelector(select.templateOf.summary).innerHTML),
};