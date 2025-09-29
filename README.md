Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## Movie Reviewer

Your Render (or alternative server) link e.g. 

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- Keep track of your movie reviews. Enter the credentials of your account and then edit your entries. 
- I had several problems with trying to rework my server file using express. I wasn't familiar with it at all, and so it took me a lot of time to figure out how to get everything working. Then, I had trouble figuring out how to connect the database to the application. Lastly, I tried to figure out a way to have the user's data be displayed once they logged in, and then I finally got it to work with a very simple solution of course. 
- I chose to just do simple username and password page. If the user enters credentials that are in the database, they will be able to contribute to that database. If the credentials aren't in the database, a new "account" is created. I did it this way because it was the simplest. If you want an account that has already been populated with data, username "ttseme" and password "pass" will display some info.
- I chose to use the Cirrus framework because the colors and style of it appealed to me and it was easy to use. 
- I have middleware_creds which authenticates the user's credentials, an either creates a new account or sends back their old one. middleware_post adds a new entry to the user's database (or modifies an existing on), and middleware_delete will delete a user's entry from their database. 

## Technical Achievements
- None

### Design/Evaluation Achievements
- None
