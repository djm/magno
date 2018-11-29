import lime from "./lib/lime.js";
import eztv from "./lib/eztv.js";
import yts from "./lib/yts.js";

export function handler(event, context, callback) {
  const searchStr = event.queryStringParameters["q"];

  Promise.all([lime.search(searchStr), yts.search(searchStr), eztv.search(searchStr)]).then(
    results => {
      const allResults = [].concat(...results);
      const sortedResults = allResults.sort((a, b) => b.seeds - a.seeds);

      callback(null, {
        contentType: "text/json",
        statusCode: 200,
        body: JSON.stringify(sortedResults),
      });
    }
  );
}
