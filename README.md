# retool-test
Certainly! Building a Retool application to scrape listings from Realtor.com and present them in a dynamic filterable table involves several steps. Here's a comprehensive guide on how to accomplish that:



### Prerequisites:

1. **Retool Account**: Sign up if you don't have one.

2. **Access to Realtor.com API or Web Scraping Setup**: Scraping directly from the site might be against the site's terms of service. Ideally, use an official API if available.

3. **Backend Server**: For web scraping, use a backend server to handle requests to Realtor.com.



### Steps:



#### 1. Set Up the Backend

Create a backend server to handle the scraping. Here's an example using Node.js and Express with the `axios` and `cheerio` libraries.



**Backend Server (Node.js):**



**Install Dependencies:**

```sh

npm install express axios cheerio cors

```



**Server Code:**

```javascript

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

```



#### 2. Set Up Retool

1. **Create a New App**: Log in to Retool and create a new app.

2. **Add a Text Input Component**: Add a text input component for the user to enter the zip code.

3. **Add a Button Component**: Add a button that the user can click to trigger the scrape.

4. **Create a Query**: Create a query to your backend server using an API resource.



**Query Configuration:**

- **Type**: REST Query

- **URL**: `http://<your-backend-url>/scrape/{{textInput.value}}`

- **Method**: GET



5. **Add a Table Component**: Add a table component to display the scraped data.

6. **Set Table Data Source**: Set the table's data source to the results of the query.



**Set Up Query Transformer (Optional)**:

   - Apply a transformer to reformat or filter the data before it is displayed in the table.



### Example Retool Component Configuration:

1. **Text Input Component**:

   - **Placeholder**: Enter Zip Code

   - **Name**: `zipCodeInput`



2. **Button Component**:

   - **Label**: Fetch Listings

   - **On Click**: Run the API query



3. **Query**:

   - **Resource**: The URL to your backend

   - **Endpoint**: `/scrape/{{zipCodeInput.value}}`

   - **Transform Data (Optional)**: Ensure the data is in the format expected by the table.



4. **Table Component**:

   - **Data Source**: `{{ yourQueryName.data }}`



5. **Filters on Table**:

   - Enable filters in the table settings to allow filtering based on columns like price, beds, baths, etc.



### Enhanced Features:

- **Filter Inputs**: Add individual inputs (slider for price range, dropdowns for beds/baths, etc.) to filter the data before it populates the table.

- **Debounce Input**: Debounce the zip code input to avoid multiple rapid calls.

- **Loading State**: Show a loading state while fetching data.



### Final Thoughts:

This example gives you a foundational Retool app that scrapes and displays real estate listings based on a user's zip code input, integrating a backend server for the scraping logic. Ensure that you take into account rate limits and other potential issues when scraping data from external websites. It's often more sustainable to use an official API if available.



Always respect a website’s usage terms to avoid legal issues.

Setting up the backend server involves deploying it to a cloud platform or hosting service. Retool itself does not provide a way to directly execute backend code for scraping; however, it can connect to APIs you set up externally. Here are common options for deploying the backend:



### Cloud Platform Options:



1. **Heroku**:

   - Simple and widely used for deploying Node.js applications.

   - Free tier available for small projects.



2. **Vercel**:

   - Ideal for serverless functions and quick deployments.

   - Good for frontend-backend integration.



3. **AWS Lambda**:

   - Serverless architecture that scales automatically.

   - Cost-effective as you pay per request.



4. **Google Cloud Functions**:

   - Another serverless option with similar benefits as AWS Lambda.



5. **DigitalOcean**:

   - Affordable droplets for more control over your server environment.

   - Managed services like App Platform available.



#### Example: Deploying on Heroku



Make sure you have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) installed.



**Steps:**

1. **Create a Heroku App**:

   ```sh

   heroku create your-app-name

   ```



2. **Deploy Your Code**:

   - Initialize a Git repository if not already.

   ```sh

   git init

   git add .

   git commit -m "Initial commit"

   ```

   - Push to Heroku.

   ```sh

   heroku git:remote -a your-app-name

   git push heroku master

   ```



3. **Start the Server**:

   Heroku will automatically start the server if your `package.json` includes a `start` script, e.g.:

   ```json

   "scripts": {

     "start": "node index.js"

   }

   ```



4. **Visit Your Heroku App**:

   - Get your app URL (e.g., `https://your-app-name.herokuapp.com`).



### Connecting to Retool



Now that you have your backend server set up and deployed, you can connect it to Retool:



1. **Create a New API Resource in Retool**:

   - Go to **Resources** > **Create new** > **REST API**.



2. **Configure the Resource**:

   - **Resource Name**: RealEstateApi

   - **Base URL**: `https://your-app-name.herokuapp.com`



3. **Set Up the Query**:

   - **REST Query**

   - **Endpoint**: `/scrape/{{zipCodeInput.value}}`



### Example Retool Setup



1. **Set Up Input Component**:

   - Add a Text Input and name it `zipCodeInput`.



2. **Add a Button**:

   - Label it "Fetch Listings".

   - Set the button's action to run the scrape query on click.



3. **Create the Query**:

   - Go to the left sidebar, click on **Queries**, and create a new REST API query.

   - Name it `fetchListings`.

   - Select the **RealEstateApi** resource.

   - Use the endpoint `/scrape/{{zipCodeInput.value}}`.



4. **Add a Table Component**:

   - Drag a Table component onto your canvas.

   - Set the Data Source to `{{ fetchListings.data }}`.



5. **Add Filters to the Table**:

   - Enable column filters within the table settings for price, beds, baths, etc.



### Enhanced Filtering Feature in Retool



To add enhanced filtering at the query level:



1. **Add additional Inputs** (e.g., Min Price, Max Price, Beds, Baths).

2. **Extend Your Query Endpoint**:

   - Modify your API endpoint to accept additional query parameters.

   - Update your query URL in Retool to include these parameters, e.g.:



   ```plaintext

   /scrape/{{zipCodeInput.value}}?min_price={{minPrice.value}}&max_price={{maxPrice.value}}&beds={{beds.value}}&baths={{baths.value}}

   ```



3. **Update Backend Logic** to Filter Results Based on Query Parameters.



With this setup, users can enter a zip code, fetch listings, and use filters to refine the displayed results dynamically within Retool.

There are several Integrated Development Environments (IDEs) and text editors you can use for creating and managing JavaScript projects. Here are some popular ones:



1. **Visual Studio Code (VS Code)**:

   - Highly recommended due to its extensive features, plugins, and community support.

   - Multi-platform support (Windows, macOS, Linux).

   - Integrated terminal, Git support, debugging capabilities, and extensions.



2. **WebStorm**:

   - A commercial product by JetBrains.

   - Excellent for JavaScript and TypeScript development, with built-in tools and refactoring.



3. **Sublime Text**:

   - Fast, lightweight, and highly customizable.

   - Supports many plugins via Package Control.



4. **Atom**:

   - Open-source, developed by GitHub.

   - User-friendly and customizable with numerous packages and themes.



**Recommended Setup with Visual Studio Code:**



### Installing Visual Studio Code



1. **Download VS Code**: 

   - [Download here](https://code.visualstudio.com/Download) and install it for your operating system.



2. **Install Git**:

   - If not already installed, [download and install Git](https://git-scm.com/downloads).



### Setting Up Your JavaScript Project in VS Code



1. **Open VS Code**.



2. **Open a New Terminal**: 

   - You can use the integrated terminal in VS Code by navigating to `View -> Terminal` or pressing `` Ctrl+` ``.



3. **Set Up Your Project Directory**:

   ```sh

   mkdir realestate-backend

   cd realestate-backend

   ```



4. **Initialize a Git Repository**:

   ```sh

   git init

   ```



5. **Initialize NPM**:

   - Create a `package.json` file.

   ```sh

   npm init -y

   ```



6. **Install Dependencies**:

   ```sh

   npm install express axios cheerio cors

   ```



7. **Create Your Project Files**:

   - Create an `index.js` file for your Node.js server code.



### Example `index.js`:

Create this file in your project directory:

```javascript

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

```



8. **Commit and Push to GitHub**:



   - First, create a repository on GitHub.



   - Then, in the VS Code terminal, run the following commands:



   ```sh

   git add .

   git commit -m "Initial commit"

   git remote add origin https://github.com/yourusername/your-repo-name.git

   git branch -M main

   git push -u origin main

   ```



### Deploy to Heroku



Since you've already created the Heroku project via the website, you can link your local repository to the Heroku app and deploy.



1. **Login to Heroku**:

   ```sh

   heroku login

   ```



2. **Setup Heroku Remote**:

   - You should see your app name in the Heroku dashboard.



   ```sh

   heroku git:remote -a your-app-name

   ```



3. **Deploy to Heroku**:

   ```sh

   git push heroku main

   ```



### Final Steps in Retool



1. **Create a New API Resource**:

   - Go to Retool, navigate to **Resources** > **Create new** > **REST API**.

   - Configure your resource with the base URL of your Heroku app: `https://your-app-name.herokuapp.com`.


2. **Create and Configure the Query in Retool**:

   - In your Retool app, go to Queries and create a new REST API Query.

   - Name it `fetchListings`.

   - Select the **RealEstateApi** resource you just created.

   - Set the endpoint to `/scrape/{{zipCodeInput.value}}`.



3. **Add Components to Your Retool App**:

   - **Zip Code Input**: Add a Text Input component and name it `zipCodeInput`.

   - **Fetch Button**: Add a Button component and set it to trigger the `fetchListings` query when clicked.

   - **Results Table**: Add a Table component and bind it to `{{ fetchListings.data }}` to display the scraped listings.



### Enhanced Filtering Feature

You can add more input fields to filter the results before displaying them.



1. **Add Filter Inputs**:

   1. Add Input components for each filter criteria (e.g., minimum price, maximum price, number of beds, number of baths).

   2. Name these inputs appropriately, e.g., `minPriceInput`, `maxPriceInput`, `bedsInput`, `bathsInput`.



2. **Update Query Endpoint**:

   - Extend your query to use these inputs. For example:

   

   ```plaintext

   /scrape/{{zipCodeInput.value}}?min_price={{minPriceInput.value}}&max_price={{maxPriceInput.value}}&beds={{bedsInput.value}}&baths={{bathsInput.value}}

   ```



3. **Update Backend Logic**:

   - Modify your backend Express code to handle these additional query parameters and filter the results accordingly.



  ```javascript

app.get('/scrape/:zipCode', async (req, res) => {

    const zipCode = req.params.zipCode;

    const minPrice = req.query.min_price || 0;

    const maxPrice = req.query.max_price || Infinity;

    const beds = req.query.beds || 0;

    const baths = req.query.baths || 0;

    const url = `https://www.realtor.com/realestateandhomes-search/${zipCode}`;



    try {

        const { data } = await axios.get(url);

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



            // Filter based on parameters

            if (listing.price >= minPrice && listing.price <= maxPrice && listing.beds >= beds && listing.baths >= baths) {

                listings.push(listing);

            }

        });



        res.json(listings);

    } catch (error) {

        res.status(500).send(`Error fetching data: ${error.message}`);

    }

});

```



4. **Connect Filters in Retool**:

   - Ensure that the URL query parameters in the Retool query reference the correct input values.



With these steps, you'll have a fully functional Retool application that  allows users to enter a zip code, retrieves and displays real estate listings, and applies filters to narrow down the listings. Each part of the project, including the frontend built in Retool and the backend hosted on Heroku, will work together seamlessly.



### Final Tips



- **Testing**: Always test each part of your setup (backend, Retool components, and queries) to ensure everything works correctly.

- **Documentation**: Document your code and setup process to make future updates and maintenance easier.

- **API Limits**: If you're scraping data, be mindful of the target website's usage terms and potential rate limits. Using an official API is preferred if available to ensure compliance and reliability.



By following these steps, you'll be well on your way to creating an efficient and fully functional application in Retool.