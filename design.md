# Features
- dashboard with hourly rate and total earnings over time
- \# trips/hour and $ amount/trip heat maps that help a user choose where/when to work in order to maximize hourly rate
- google calendar integration that highlights open intervals and their potential hourly rates

# Frontend
- login screen to keep data private
- dashboard page: Total Income graph, Hourly Rate graph
- trips/hour and amount/trip heatmap buttons

# Backend
- heatmaps
  - uber driver web app scraper
  - google location data fetcher
  - logic that combines the two into single source of truth
  - database logic to filter visualizations by time of day/week
- user authentication

# Data Needed
- uber eats trip data
- google location data to get more accurate trip begin/endpoints
