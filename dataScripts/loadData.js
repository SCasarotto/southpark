const puppeteer = require('puppeteer');
const fs = require('fs');

const SITE_URL = 'https://southpark.cc.com/wiki/List_of_Episodes';

const getAllEpisodes = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable to see console logs in the evaluate function
  // page.on('console', (msg) => {
  //   for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`);
  // });

  await page.goto(SITE_URL);

  // The tables of episodes are insides #mw-content-text > .mw-parser-output
  // They are structured as a h2 title "Season 1", followed by a table
  // Each row has a tr.above containing an image in the first td and the title in the second td
  const episodes = await page.evaluate(() => {
    const episodeTables = Array.from(
      document.querySelectorAll('#mw-content-text > .mw-parser-output table'),
    );

    return episodeTables.reduce((acc, table, tableIndex) => {
      // The last table are "events" so we will use an "e" for that season number
      const season = tableIndex === episodeTables.length - 1 ? 'e' : tableIndex + 1;
      const rows = Array.from(table.querySelectorAll('tr.above'));

      const seasonEpisodes = rows.map((row, index) => {
        const [image, titleElement] = row.querySelectorAll('td');
        const title = titleElement.innerText;
        const episode = index + 1;
        const thumbnailUrl = image.querySelector('img').src;

        return {
          season,
          episode,
          title,
          thumbnailUrl,
        };
      });

      return [...acc, ...seasonEpisodes];
    }, []);
  });

  await browser.close();
  console.log(`Found ${episodes.length} episodes!`);
  return episodes;
};

// TODO:
// - Add versioning
// - Add a way to compare with the existing data and only update the new episodes
const main = async () => {
  const episodes = await getAllEpisodes();
  fs.writeFileSync('./data/episodes.json', JSON.stringify(episodes));
};
main();
