# Realtor.com Scraper using Retool and Node.js

This project demonstrates how to build a simple web scraping API using Node.js, Express, and Cheerio, which integrates with Retool. The API scrapes Realtor.com listings based on specified criteria and displays the results in a Retool application.

## Features

- Search properties by zip code.
- Filter results by price range, bed count, and bath count.
- Display results in a responsive Retool table.

## Technology Stack

- **Backend**: Node.js, Express, Cheerio, ScraperAPI (for proxy handling).
- **Frontend**: Retool.

## Setup Instructions

### Prerequisites

- Node.js installed on your local machine.
- A Retool account.

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/realtor-scraper.git
   cd realtor-scraper
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Set up ScraperAPI**:

   - Register for an account at [ScraperAPI](https://www.scraperapi.com/).

   - Obtain your API key.

4. **Update `index.js` with your ScraperAPI key**:

   Edit the following line in `index.js`:

   ```javascript

   const SCRAPER_API_KEY = 'YOUR_SCRAPERAPI_KEY';  // Replace 'YOUR_SCRAPERAPI_KEY' with your actual ScraperAPI key

   ```

5. **Start the server**:

   ```sh

   npm start

   ```

6. **Deploy to Heroku** (if not already done):

   - Create a new Heroku app.

   - Deploy your code to Heroku:

     ```sh

     heroku create your-app-name

     git push heroku main

     ```

   - Ensure Heroku installs the correct dependencies:

     ```sh

     npm install

     ```

### Retool Setup

1. **Create a New Resource in Retool**:

   - Point the resource to your Heroku app's URL.

2. **Set Up Input Components**:

   - Add Text and Number Input components for zip code, min price, max price, min beds, max beds, min baths, and max baths.

3. **Create a Query in Retool**:

   - Query Type: **GET**

   - Resource URL:

     ```plaintext

     {{ baseUrl }}/scrape/{{ zipCodeInput.value }}?min_price={{ minPriceInput.value || 0 }}&max_price={{ maxPriceInput.value || Infinity }}&min_beds={{ minBedsInput.value || 0 }}&max_beds={{ maxBedsInput.value || 0 }}&min_baths={{ minBathsInput.value || 0 }}&max_baths={{ maxBathsInput.value || 0 }}

     ```

4. **Configure the Table Component**:

   - Set the Data property of the Table to: `{{ getListings.data }}`.


5. **Trigger the Search**:

   - Use a Button component to execute the search query when clicked.


## Usage

- Start the server locally using `npm start`.
- Access the API endpoint via your Retool app to perform searches and display results.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ScraperAPI](https://www.scraperapi.com/) for providing a proxy service to handle web scraping.
- [Cheerio](https://cheerio.js.org/) for HTML parsing and manipulation.
- [Retool](https://retool.com/) for building user interfaces quickly and efficiently.

## Contact

For inquiries or support, please contact [brunodp.oliveira@gmail.com].

Thank you for using this Realtor.com Scraper!

```

### Instructions

1. Replace all placeholders (like `yourusername`, `your-app-name`, `YOUR_SCRAPERAPI_KEY`, and your contact email) with your actual information.

2. Save the content above into a file named `README.md` in the root of your repository.

3. Commit and push the `README.md` file to your repository:

   ```sh
   git add README.md
   git commit -m "Add README.md"
   git push origin main
   ```

Feel free to customize the README.md further based on your preferences and project specifics. Good luck with your demo and your job application!