# gigMax
## What is this?
gigMax helps Uber Eats delivery drivers maximize their hourly rate by using their google location history and past trip data to produce two key visualizations:
- $ amount/trip heatmap filterable by time of day/day of week
- \# deliveries/hour heatmap filterable by time of day/day of week  

## What problem does it solve?
Using these heatmaps, drivers can decide where/when they want to work in order to maximize their hourly rate. Anecdotally, I've earned earned between $10-$20/hour, so there is large variability in earnings and a chance to provide a significant impact to drivers' bottom-lines:

- potential value provided = +$10/hours * 160 hours/month
- if I charge $99/month, a full-time driver can potentially increase their earnings by $1,501/month

## What challenges did you face? Would you do anything different?
- Uber Driver web app contains incomplete data. For example, if I completed 20 trips in a week, the app would give details for only 10 of them. My first thought was to scrap the project because this would further reduce the trip data sample size. I quickly reconsidered and decided to add a manual entry feature, where gigMax told you a week's data was incomplete then allowed you to upload the missing trips. Despite being cumbersome, I thought it would still be worth it for drivers when they compared it to their potential increased earnings of ~$1,500/month.
- after scraping, I had csv files and html content (later parsed to json). The question was: do I combine the data sources then insert into db or insert one piece into db then the other? I didn't investigate this too much, but my intuition was to go for the first for the following reasons:
  - combining data with node is easier than with SQL (I don't know SQL so well)
  - waiting on data to post to cloud db 2x would take longer than 1x
- I had to decide whether to mutate state of trip data or go with a functional approach that calculated a trip url every time it was requested. It was unclear because adding a trip url field means only calculating once, but also introduces data corruption risks. By calculating trip url each time, the total calculations increase, but there is a reduced risk of data corruption. I chose to go with a functional approach and avoid state mutation because most drivers will be doing on the order of 100s of trips, so there aren't a lot of calculations. I gain more confidence with trip data state at a minimal cost. It will be worth a look again if the system starts to process more trips.
- relative import complexity: I initially tried to break up the app into different pieces, but ran into difficulties with relative imports. I went with centralizing all functions in one file in order to push off import complexity to later. My rationale is it's better to focus on app functionality than modularization at the beginning stages. Time will tell how this works. This turned out to work. I soon after shipped downloading trip details page html content and pushed off separating components to later.  
- As I was trying to reintegrate my prematurely separated components, I ran into trouble meshing async/sync code. This seemed like a great time to crack open the Asynchronous Programming chapter in Eloquent Javascript by Marijn Haverbeke.
## What mistakes did you make? Would you do anything different?
- didn't fully explore the website manually: I ran into a dead-end with one approach to get all the trip data and got discouraged. I thought about scrapping the project. Then, I manually browsed the website again and found the current approach to grabbing relevant data. If I had given up early, I would have missed the current approach.  

## What technical decisions did you make? Why?
- React frontend: fast prototyping, familiarity allowed me to focus on business logic
- Node backend: fast prototyping, familiarity allowed me to focus on business logic
- PostgreSQL database: open-source database common in startups. I would like to build my own startup or work at a startup, so this choice increases my value in either scenario
- TDD: I hope to add more features to gigMax, and TDD will help make my codebase extensible by reducing risk of breaking changes. The tradeoff is more initial time to build, which I think was worth it.

## What tech stack did you use? Why?

## How can I get a demo of this project?
- build from source (give instructions)
- npm i __
- go to __.com
- check out youtube.com/{??}
