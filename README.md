# frontend_interview_test_mcmakler

A responsive page to view listings from McMakler.
Listings are fetched via their public API and stored in a variable for pagination.
Users can click on the 'Prev' and 'Next' buttons to go to the previous or next page of listings, currently set at 12 listings per page. When either of those buttons are clicked, the HTML for the page is built using the templates and stored in an object so if a user goes to a different page and returns to that one, there is no need to rebuild the entire properties object and HTML again, simple replace with the HTML.

## Tech Used
### HTML
* The HTML for the project turned out to be realy short because I'm using templates. I have experience with Handlebars.js but opted to go Vanilla.

### CSS
* Vanilla CSS but in the future I would use SASS to make it easier to maintain, especially with variables.

### Vanilla Javascript (ES6)
* I used vanilla JavaScript for this test because I believe it's very important to understand, not just frameworks. Once we understand Vanilla JavaScript completely. We can use frameworks and actually know how it works under the hood. This was my first time experimenting with ES6 and I'm happy with the result.

### Gulp
* I'm using Gulp to simplify things suchs as automatic browser reloading on saved files, linting JavaScript and passing it through babel as well as minifying the files. The the linting, I am using Airbnb's style guide.

### Google Fonts & Font Awesome
* Just to make things a little nicer.