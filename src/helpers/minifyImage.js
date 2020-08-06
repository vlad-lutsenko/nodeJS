const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");

module.exports = async (pathToFile, destination) => {
  const minImage = await imagemin([pathToFile], {
    destination: destination,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  console.log("pathToFile ->", pathToFile); //  pathToFile -> E:\goit\homeworks\node\hw5\nodeJS\temp\karabas@mail.com-avatar.png
  console.log("destination ->", destination); // destination -> E:\goit\homeworks\node\hw5\nodeJS\public\images

  console.log("minification is done"); //   minification is done
  console.log("minImage ->", minImage); // minImage -> []

  return minImage;
};
