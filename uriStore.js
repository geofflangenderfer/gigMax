const BASE_TRIP_URL = "https://drivers.uber.com/p3/payments/trips/";
const STATEMENTS_URL = "https://drivers.uber.com/p3/payments/statements";
const TRIP_HTML_DIR = "./data/raw/tripHTML/";
const CSV_DIR = "./data/raw/statementCSVs";
const JSON_STATEMENT_DIR = './data/intermediate/statementJSONs';
const JSON_PAGE_DATA_DIR = './data/intermediate/pageData/';
const INCOMPLETE_TRIP_IDS = './tripIDsWithIncompleteData.csv';
const JSON_MERGED_DIR = './data/final/';

module.exports = {
  BASE_TRIP_URL,
  STATEMENTS_URL,
  TRIP_HTML_DIR,
  CSV_DIR,
  JSON_STATEMENT_DIR,
  JSON_PAGE_DATA_DIR,
  INCOMPLETE_TRIP_IDS,
  JSON_MERGED_DIR,
};
