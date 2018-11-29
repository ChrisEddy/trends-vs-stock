const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 9000;
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/*', express.static(path.join(__dirname, '../', 'build')));

const googleTrends = require('google-trends-api');

app.post('/trend', bodyParser.json(), async (req, res) =>{
    if(req.body.query){
        googleTrends.interestOverTime({keyword: req.body.query, startTime: new Date(new Date().setFullYear(new Date().getFullYear() - 1))})
        .then(function(results){
          res.json({'result': JSON.parse(results)});
        })
        .catch(function(err){
          console.error('ERROR:', err);
          res.json({'result': err});
        });
    }
    else{
        res.json({'result': 'no keyword provided'});
    }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));