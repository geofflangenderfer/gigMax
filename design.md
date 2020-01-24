# Features
- manual trip upload: gigMax tells you if a week contains incomplete trip data from the web app and gives you a form to upload the missing trips from the mobile app.
- user asks google assistant app when it should work this week -> app gives back top 2 $/hr slots and asks user if they'd like to add to their calendar
- earnings dashboard: $/hr, $/week, $/month, heatmaps
- notification of upcoming high $/hr promotions
- true cost feature: your fares represent revenue, but you also have costs: depreciation, gas, parking, maintenance, tickets, taxes, insurance, monthly car payment. True cost shows you your salary after all these things.

- user goes to Coach Max tab and it tells him DOW/TOD/location to work given his calendar availability, home location, and vehicle type
- user goes to # deliveries/hour heatmap and sees that UT campus is best. He'll keep this is mind when there's a # deliveries bonus
- user goes to $ amount/delivery heatmap and sees dt is best. He'll focus his time there unless he has a good reason to move elsewhere
- user goes to peer ranking tab and sees that he's in 90th percentile for $ earned/month and 50th for $/hr
- user goes to where did i go tab to see a replay of his work night with chronological pickups/dropoffs
- user goes to apt building tab to note an entrance code
- blacklist restaurants/customers

# Driver Interests
- am i getting better over time (create baseline to compare current performance)?
- how does this job compare to others? Higher/lower $/hr?
- how am I doing compared to my peers?
- should I rent a car or use a bike?

# Feature Stack Rank: Descending Importance
- earnings dashboard: easy to build and validates that couriers are interested in this information.
  - finish data processing 
  - store into db
  - data request queries (can publish blog article at this point)
  - display on react frontend
  - login
- blog article explaining how I use data to maximize my hourly

# Frontend
- login screen to keep data private
- dashboard page: Total Income graph, Hourly Rate graph
- calendar showing $/hr amounts for free blocks
- Coach Max: Max recommends when you should work given calendar availability
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
- google calendar
- google location data to get more accurate trip begin/endpoints
- weather for bike drivers
