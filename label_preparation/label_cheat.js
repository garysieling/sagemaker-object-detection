const fs = require('fs');
const type = process.argv[2]

const data = {};

fs.writeFileSync('validation_' + type + '.json', JSON.stringify(data, null, 2));
