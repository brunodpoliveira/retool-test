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
  const minPrice = req.query.min_price || 0;
  const maxPrice = req.query.max_price || Infinity;
  const beds = req.query.beds || 0;
  const baths = req.query.baths || 0;
  const url = `https://www.realtor.com/realestateandhomes-search/${zipCode}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    let listings = [];

    $('.component_property-card').each((i, element) => {

      let price = $(element).find('.price').text().replace(/[^\d]/g, ''); // Remove non-numeric characters
      price = parseInt(price, 10);

      const listing = {
        address: $(element).find('.address').text(),
        price: price,
        beds: parseInt($(element).find('.beds').text(), 10),
        baths: parseInt($(element).find('.baths').text(), 10),
        sqft: $(element).find('.sqft').text(),
        link: $(element).find('a.jsx-###href-class').attr('href')
      };

      if (listing.price >= minPrice && listing.price <= maxPrice && listing.beds >= beds && listing.baths >= baths) {
        listings.push(listing);
      }
    });
    res.json(listings);

  } catch (error) {
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});