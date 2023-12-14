const axios = require('axios');
const fs = require('fs');

// Function to create a folder if it doesn't exist
const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

// Function to check if a file exists
const fileExists = (path) => fs.existsSync(path);

// Function to download image from url
const downloadImage = async (imageUrl, imagePath) => {
  const response = await axios({
    method: 'GET',
    url: imageUrl,
    responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(imagePath));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', (err) => {
      reject(err);
    });
  });
};

const processEpisode = async (episode) => {
  const { thumbnailUrl, season, episode: episodeNumber } = episode;

  // Season might be "e" for event. If so, we will use "e" as the season number
  const seasonNumber = season === 'e' ? season : season < 10 ? `0${season}` : season;
  const episodeNumberString = episodeNumber < 10 ? `0${episodeNumber}` : episodeNumber;
  const fileType = thumbnailUrl.split('.').pop();
  const path = `./images/s${seasonNumber}/e${episodeNumberString}.${fileType}`;

  // Create the season folder if it doesn't exist
  createFolder(`./images/s${seasonNumber}`);

  // Check if the image already exists
  if (fileExists(path)) {
    // console.log(`Skipping ${path} (already exists)`);
    return;
  }

  // Download the image and save it to the images folder with a path matching the season and episode number
  try {
    // console.log(`Downloading ${thumbnailUrl} for s${seasonNumber} e${episodeNumber}`);
    await downloadImage(thumbnailUrl, path);
  } catch (e) {
    console.log(
      `Error occurred trying to load ${thumbnailUrl} for s${seasonNumber} e${episodeNumber}`,
      // e,
    );
  }
};

// Load json data
const episodes = require('../data/episodes.json');

const downloadImages = async () => {
  // Loop through each episode and get the thumbnailUrl one by one
  for (let i = 0; i < episodes.length; i++) {
    await processEpisode(episodes[i]);
  }
};
downloadImages();
