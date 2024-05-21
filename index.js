const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/scrape/:zipCode', async (req, res) => {

    const zipCode = req.params.zipCode;
    const url = `https://www.realtor.com/realestateandhomes-search/${zipCode}`;

    try {

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let listings = [];

        $('.component_property-card').each((i, element) => {

            const listing = {

                address: $(element).find('.address').text(),
                price: $(element).find('.price').text(),
                beds: $(element).find('.beds').text(),
                baths: $(element).find('.baths').text(),
                sqft: $(element).find('.sqft').text(),
                link: $(element).find('a.jsx-###href-class').attr('href')
            };
            listings.push(listing);
        });

        res.json(listings);

    } catch (error) {

        res.status(500).send(`Error fetching data: ${error.message}`);

    }

});

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});