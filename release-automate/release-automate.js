const request = require("request");
const fs = require("fs");

function handleBody(body) {
  let versions = [];
  body.forEach(tag => {
    versions.push(tag.name);
  });
  //console.log("Versions: ", versions);

  let latestTag = "0.0.0";
  versions.forEach(candidate => {
    if (/^[0-9\.]+$/.test(candidate)) {
      let candidateParts = candidate.split(".");
      let latestParts = latestTag.split(".");
      //console.log(latestParts)
      //console.log(candidateParts)
      if (candidateParts.length == 3) {
        if (parseInt(latestParts[0]) <= parseInt(candidateParts[0])) {
          //console.log(latestParts[0] + " <= " + parseInt(candidateParts[0]));
          if (parseInt(latestParts[1]) <= parseInt(candidateParts[1])) {
            //console.log(latestParts[1] + " <= " + parseInt(candidateParts[1]));
            if (parseInt(latestParts[2]) <= parseInt(candidateParts[2])) {
              //console.log(latestParts[2] + " <= " + parseInt(candidateParts[2]));
              //console.log("latest ", latestTag, " becomes ", candidate);
              latestTag = candidate;
            }
          }
        }
      }
    }
  });

  //console.log("latest tag from GitHub: " + latestTag);

  const latestVersion = fs
    .readFileSync("../version.properties", "utf8")
    .split(" ")[2]
    .trim();
  //console.log("Latest version in this repo: " + latestVersion);

  if (latestVersion !== latestTag) {
    //console.log(latestVersion + "' != '" + latestTag + "'");
    console.log(latestTag);
    process.exit(0)
  } else {
    process.exit(1)
  }
}

const options = {
  url: "https://api.github.com/repos/tomakehurst/wiremock/tags",
  headers: {
    "User-Agent": "Awesome-Octocat-App",
    "Authorization": "token " + process.env.GH_TOKEN
  }
};

request(options, function (error, response, body) {
  try {
    handleBody(JSON.parse(body))
  } catch (e) {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    process.exit(1)
  }
});
