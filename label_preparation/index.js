const fs = require('fs');
const text = fs.readFileSync('termite tubes.json', 'utf8');
const data = text.split(/[\r\n]/);
let script = '';

let test = '';
let train = '';

data.filter(
	(row) => row.length > 0
).map(
	(row) => {
		//console.log(row);
		return JSON.parse(row)
	}
).map(
	(data) => {
    if (!data.annotation) { return ; }

    console.log(JSON.stringify(data, null, 2));
    const file = data.content.replace(/.*[/]/, '');
    const out = 'labels/' + file.replace(/[.]jpeg/, '.jpg');
	  script = script + 'curl -o ' + out + ' ' + data.content + "\n";
		let labels = "";

    let imageWidth = 0;
    let imageHeight = 0;

		let awsAnnotations = data.annotation.map(
			(annotation) => {
        imageWidth = annotation.imageWidth;
        imageHeight = annotation.imageHeight;
        //console.log(JSON.stringify(annotation, null, 2));
				const x1 = Math.min.apply(Math, annotation.points.map( (p) => p[0] ));
				const y1 = Math.min.apply(Math, annotation.points.map( (p) => p[1] ));
				const x2 = Math.max.apply(Math, annotation.points.map( (p) => p[0] ));
				const y2 = Math.max.apply(Math, annotation.points.map( (p) => p[1] ));

				const width = x2 - x1;
				const height = y2 - y1;
				const label = annotation.label[0].replace(/ /g, '_');
				const xc = (x2 + x1) / 2;
				const yc = (y2 + y1) / 2;

        //console.log(x1, y1, x2, y2, xc, yc, width, height);
				const string = "0" + " " + xc + " " + yc + " " + width + " " + height;
				//const string = "0 0.5 0.5 0.100 0.100";
        //const string = `14 0.750704225352 0.834 0.402816901408 0.332`;
				labels = labels + string + "\n";

        return {
          class_id: 0,
          left: Math.round(x1*imageWidth),
          width: Math.round(width*imageWidth),
          top: Math.round(y1*imageHeight),
          height: Math.round(height*imageHeight)
        };
			}
		)

    const filename = file.substring(0, file.lastIndexOf('.'));

    const aws_data = {
      "file": "images/" + filename + '.jpg',
      "image_size": [
        {
          "width": imageWidth,
          "height": imageHeight,
          "depth": 3
        }
      ],
      "annotations": awsAnnotations,
      "categories": [
        {
          "class_id": 0,
          "name": "termite_tube"
        }
      ]
    };

    fs.writeFileSync('./aws_labels/' + filename + '.json', 
			JSON.stringify(aws_data, null, 2)); 
    fs.writeFileSync('./labels/' + filename + '.txt', labels);
    if (Math.random() > 0.25) {
			train += out + "\n";
    } else {
			test += out + "\n";
    }
		// console.log(data)
	}
);

fs.writeFileSync('images.sh', script);
fs.writeFileSync('cfg/train.txt', train);
fs.writeFileSync('cfg/test.txt', test);
