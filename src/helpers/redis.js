const redis = require('redis');

const configs = require('../configs/configs');

const REDIS_PORT = configs.redisPort; // process.env.REDIS_PORT;

// const app = express();
const client = redis.createClient(REDIS_PORT);

client.on('error', function(err) {
  console.log('redis error: ', err);
});

module.exports = {

  cache: function(req, res, next) {
    let page = 1;
    if (req.query.page != null) {
      page = req.query.page;
    }

    // get data search from url
    const name = req.query.name;
    const company = req.query.company;
    const order = req.query.order;
    const search_data = {name, company, order, page};

    let redisKey = '';
    for (q in search_data) {
      if (Object.prototype.hasOwnProperty.call(search_data, q)) {
        redisKey = redisKey + q;
        redisKey = redisKey + search_data[q];
      }
    }

    console.log(redisKey);
    console.log('DESIGN THE REDIS KEY');

    client.get(redisKey, function(err, result) {
      if (err) throw err;

      if (result != null) {
        console.log('USE DATA CACHE FROM REDIS');
        res.send(JSON.parse(result));
      } else {
        next();
      }
    });
  },

  client,

};
