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
  const minPrice = parseInt(req.query.min_price) || 0;
  const maxPrice = parseInt(req.query.max_price) || Infinity;
  const beds = parseInt(req.query.beds) || 0;
  const baths = parseInt(req.query.baths) || 0;
  const url = `https://www.realtor.com/realestateandhomes-search/${zipCode}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const scriptContent = $('#__NEXT_DATA__').html();
    if (!scriptContent) {
      console.error('Data script not found');
      return res.status(404).send('Data script not found');
    }
    const jsonData = JSON.parse(scriptContent);
    const properties = jsonData?.props?.pageProps?.properties;
    if (!properties) {
      console.error('No property data found');
      return res.status(404).send('No property data found');
    }
    const listings = properties
      .filter(property => property.list_price >= minPrice && property.list_price <= maxPrice)
      .filter(property => property.description.beds >= beds && property.description.baths_consolidated >= baths)
      .map(property => ({
        address: property.location.address.line,
        price: property.list_price,
        beds: property.description.beds,
        baths: property.description.baths_consolidated,
        sqft: property.description.sqft,
        link: `https://www.realtor.com/realestateandhomes-detail/${property.permalink}`
      }));
    res.json(listings);

  } catch (error) {
    console.error('Error fetching data:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});