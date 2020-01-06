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

## What mistakes did you make? Would you do anything different?

## What technical decisions did you make? Why?
- React frontend: fast prototyping, familiarity allowed me to focus on business logic
- Node backend: fast prototyping, familiarity allowed me to focus on business logic
- PostgreSQL database: open-source database common in startups. I would like to build my own startup or work at a startup, so this choice increases my value in either scenario
- TDD: I hope to add more features to gigMax, and TDD will help make my codebase extensible by reducing risk of breaking changes. The tradeoff is more initial time to build, which I think was worth it.

## What tech stack did you use? Why?

