const axios = require("axios"),
  fs = require("fs");

const getAllBuilds = async () =>
  axios
    .get("https://papermc.io/api/v2/projects/paper/version_group/1.18/builds")
    .then(async (resp) => {
      const builds = resp.data.builds,
        { version, build } = builds[builds.length - 1],
        fileName = `paper-${version}-${build}.jar`,
        url = `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${build}/downloads/${fileName}`;

      return { build, version, url, fileName };
    });

const downloadFile = async (url, fileName) => {
  const writer = fs.createWriteStream("./" + fileName);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const cleanupOldVersions = (current) => {
  const files = fs.readdirSync("./");
  let latest = 0,
    latestFile = "";

  files.forEach((file) => {
    if (file !== current && file.startsWith("paper-")) {
      const build = parseInt(file.split("-")[2].split(".")[0]);
      if (build > latest) {
        latest = build;
        latestFile = file;
      }
    }
  });

  files.forEach(
    (file) =>
      file !== current &&
      file !== latestFile &&
      file.startsWith("paper-") &&
      fs.unlinkSync("./" + file)
  );
};

const checkIfFileExists = (fileName) => fs.existsSync("./" + fileName);

const main = async () => {
  const { build, version, url, fileName } = await getAllBuilds();
  if (!checkIfFileExists(fileName)) {
    console.log(`Updating server to ${version}-${build}...`);
    await downloadFile(url, fileName);
    console.log("Cleaning up old versions...");
    cleanupOldVersions(fileName);
    console.log("Done.");
  } else console.log("Server is up to date.");
};

main();
