const fs = require('fs');
const type = process.argv[2]

const data = {};
let text = '';

const files = fs.readdirSync('temp/');
files.map(
  (file) => {
    text += JSON.stringify(
      {
        "content": "images/" + file,
        "annotation":[
          {
            "shape":"rectangle",
            "points":[[0,0],[1,0],[0,1],[1,1]],
            "notes":"",
            "imageWidth":500,"imageHeight":500
          }
        ],
        "extras":null,
        "metadata":{
          "first_done_at":0,
          "last_updated_at":0,
          "sec_taken":0,
          "last_updated_by":"",
          "status":"done","evaluation":"NONE"
        }
      }) + "\n";
  }
);

fs.writeFileSync('validation_' + type + '.json', text);
