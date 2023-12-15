const fs = require('fs');

// Read the images folder and generate a list of images
// This should come in the form of an array of arrays, where each inner array is a season
// and each item should be an image path
const main = () => {
  const images = [];
  // Get all folders in the images folder
  const seasons = fs
    .readdirSync('./images', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  for (let i = 0; i < seasons.length; i++) {
    const season = seasons[i];
    const seasonImages = fs.readdirSync(`./images/${season}`);
    images.push(seasonImages.map((image) => `./images/${season}/${image}`));
  }

  fs.writeFileSync('./data/images.json', JSON.stringify(images));
};
main();
