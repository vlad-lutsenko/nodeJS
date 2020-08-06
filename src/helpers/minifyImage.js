const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const fs = require("fs").promises;

module.exports = async (pathToFile, destination) => {
  const minImage = await imagemin([pathToFile], {
    destination,
    glob: false,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  fs.unlink(pathToFile);

  return minImage;
};
