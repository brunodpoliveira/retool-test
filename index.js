const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
const SCRAPER_API_KEY = 'c7a210349447adac07a18eff792c6896';
app.get('/', (req, res) => {
  res.send('Welcome to the Realtor.com Scraper API. Use the /scrape/:zipCode endpoint.');
});

app.get('/scrape/:zipCode', async (req, res) => {
  const zipCode = req.params.zipCode;

  const url = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=https://www.realtor.com/realestateandhomes-search/${zipCode}`;

  try {
    console.log(`Fetching data from URL: ${url}`);
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);
    const scriptContent = $('#__NEXT_DATA__').html();
    if (!scriptContent) {
      console.error('Data script not found');
      return res.status(404).send('Data script not found');
    }
    let jsonData;
    try {
      jsonData = JSON.parse(scriptContent);
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError.message);
      return res.status(500).send('Error parsing JSON data');
    }
    const properties = jsonData?.props?.pageProps?.properties;
    if (!properties) {
      console.error('No property data found');
      console.error('jsonData:', jsonData);
      return res.status(404).send('No property data found');
    }

    const listings = properties.map(property => ({
      address: property.location.address.line,
      price: property.list_price,
      beds: property.description.beds,
      baths: property.description.baths_consolidated,
      sqft: property.description.sqft,
      link: `https://www.realtor.com/realestateandhomes-detail/${property.permalink}`
    }));
    res.json(listings);

  } catch (error) {
    const errorMsg = error.message;
    const responseStatus = error.response ? error.response.status : 'Unknown';
    //const responseData = error.response ? error.response.data : 'No response data';
    console.error('Error fetching data:', errorMsg, 'Response status:', responseStatus);
    //console.error('Response data:', responseData);
    res.status(500).send(`Error fetching data: ${errorMsg}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});