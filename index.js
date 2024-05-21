const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Realtor.com Scraper API. Use the /scrape/:zipCode endpoint.');
});

app.get('/scrape/:zipCode', async (req, res) => {

  const zipCode = req.params.zipCode;
  const url = `https://www.realtor.com/realestateandhomes-search/${zipCode}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    let scriptContent = $('#__NEXT_DATA__').html();
    if (!scriptContent) {
      return res.status(404).send('Data script not found');
    }
    const jsonData = JSON.parse(scriptContent);

    const listings = jsonData.props.pageProps.searchResults.home_search.results.map(listing => ({

      address: listing.location.address.line,
      price: listing.list_price,
      beds: listing.description.beds,
      baths: listing.description.baths_consolidated,
      sqft: listing.description.sqft,

      link: `https://www.realtor.com/realestateandhomes-detail/${listing.permalink}`
    }));

    res.json(listings);

  } catch (error) {
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});