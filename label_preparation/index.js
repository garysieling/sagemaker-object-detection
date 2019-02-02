const _ = require('lodash');

const labels = [
  'termite_tubes', 
  'hot_water_expansion_tank',
  'asbestos_paper_insulation',
  'pedestal_sump_pump',
  'validation1',
  'validation_breaker_box'
];

const classIds = {}
classIds['termite_tubes'] = 0;
classIds['termite tubes'] = 0;
classIds['hot_water_expansion_tank'] = 1;
classIds['asbestos'] = 2;
classIds['asbestos_paper_insulation'] = 2;
classIds['pedestal_sump_pump'] = 3;
classIds['fuel_tank'] = 4;
classIds['water_softener'] = 5;
classIds['breaker_box'] = 6;
classIds['fire_damage'] = 7;
classIds['washer'] = 8;
classIds['dryer'] = 9;
classIds['smoke_detector'] = 10;
classIds['furnace'] = 11;

const labelMapping = {};
labelMapping[0] = 'termite_tubes';
labelMapping[1] = 'hot_water_expansion_tank';
labelMapping[2] = 'asbestos';
labelMapping[3] = 'pedestal_sump_pump';
labelMapping[4] = 'fuel_tank';
labelMapping[5] = 'water_softener';
labelMapping[6] = 'breaker_box';
labelMapping[7] = 'fire_damage';
labelMapping[8] = 'washer';
labelMapping[9] = 'dryer';
labelMapping[10] = 'smoke_detector';
labelMapping[11] = 'furnace';

const uniqLabels = _.uniq(
  labels.map(
    (label) => classIds[label]
  ).map(
    (id) => labelMapping[id]
  ).filter( 
    (x) => !!x
  )
);

console.log(uniqLabels);
console.log(uniqLabels.length);

let validationCount = {};
let annotationCount = {};

const classNames = _.keys(labelMapping).filter(
  (key) => uniqLabels.includes(key)
).map(
  (key) => {
    return {
      "class_id": parseInt(key),
      "name": labelMapping[key]
    };
  }
);

const fs = require('fs');

let script = '';

let test = '';
let train = '';

labels.map(
  (label, index) => {
    const text = fs.readFileSync(label + '.json', 'utf8');
    const data = text.split(/[\r\n]/);

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

        const isValidation = label.indexOf('validation') >= 0;
        //console.log(JSON.stringify(data, null, 2));
        const labels_dir = label === isValidation ? 'validation_txt' : 'labels';
        const aws_labels_dir = label === isValidation ? 'validation_labels' : 'aws_labels';
        const images_dir = 'images';
        const file = data.content.replace(/.*[/]/, '');
        const out = images_dir + '/' + file.replace(/[.]jpeg/, '.jpg');
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
		    		const label = annotation.label[0];

			    	const xc = (x2 + x1) / 2;
	    			const yc = (y2 + y1) / 2;

            //console.log(x1, y1, x2, y2, xc, yc, width, height);
				    //const string = classid + " " + xc + " " + yc + " " + width + " " + height;
		    		//const string = "0 0.5 0.5 0.100 0.100";
        //const string = `14 0.750704225352 0.834 0.402816901408 0.332`;
			    	//labels = labels + string + "\n";
            if (classIds[label] == undefined) {
              console.log(label);
            }

            if (isValidation) {
              validationCount[label] = (validationCount[label] || 0) + 1;
            } else {
              annotationCount[label] = (annotationCount[label] || 0) + 1;
            }

            const labelId = classIds[label];
            const remapped = labelMapping[labelId];
            if (uniqLabels.indexOf(remapped) < 0) {
              //console.log(label);
              return;
            }

            return {
              class_id: parseInt(labelId),
              left: Math.round(x1*imageWidth),
              width: Math.round(width*imageWidth),
              top: Math.round(y1*imageHeight),
              height: Math.round(height*imageHeight)
            };
			    }
		    ).filter( (x) => !!x )

        const filename = file.substring(0, file.lastIndexOf('.'));

        const aws_data = {
          "file": images_dir + "/" + filename + '.jpg',
          "image_size": [
            {
              "width": imageWidth,
              "height": imageHeight,
              "depth": 3
            }
          ],
          "annotations": awsAnnotations,
          "categories": classNames
        };

        if (awsAnnotations.length > 0) {
          fs.writeFileSync('./' + aws_labels_dir + '/' + filename + '.json', 
		      	JSON.stringify(aws_data, null, 2)); 
        }
        //fs.writeFileSync('./' + labels_dir + '/' + filename + '.txt', labels);
        /*if (Math.random() > 0.25) {
			    train += out + "\n";
        } else {
			    test += out + "\n";
        }*/
    		// console.log(data)
	    }
    );
	}
);

fs.writeFileSync('images.sh', script);
//fs.writeFileSync('cfg/train.txt', train);
//fs.writeFileSync('cfg/test.txt', test);

console.log('Annotation count: ' + JSON.stringify(annotationCount, null, 2));
console.log('Validation count: ' + JSON.stringify(validationCount, null, 2));
