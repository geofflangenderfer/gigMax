const BASE_TRIP_URL = "https://drivers.uber.com/p3/payments/trips/";
const STATEMENTS_URL = "https://drivers.uber.com/p3/payments/statements";
const TRIP_HTML_DIR = "/home/geoff/work/gigMax/data/raw/tripHTML/";
const CSV_DIR = "/home/geoff/work/gigMax/data/raw/statementCSVs/";
const JSON_STATEMENT_DIR = '/home/geoff/work/gigMax/data/intermediate/statementJSONs/';
const JSON_PAGE_DATA_DIR = '/home/geoff/work/gigMax/data/intermediate/pageData/';
const INCOMPLETE_TRIP_IDS = '/home/geoff/work/gigMax/data/incompleteTripIDs.json';
const JSON_MERGED_DIR = '/home/geoff/work/gigMax/data/final/';
const INCOMPLETE_TRIP_HTML_FILE = '/home/geoff/work/gigMax/incompleteHTMLDownloads.txt';

module.exports = {
  BASE_TRIP_URL,
  STATEMENTS_URL,
  TRIP_HTML_DIR,
  CSV_DIR,
  JSON_STATEMENT_DIR,
  JSON_PAGE_DATA_DIR,
  INCOMPLETE_TRIP_IDS,
  JSON_MERGED_DIR,
  INCOMPLETE_TRIP_HTML_FILE,
};
