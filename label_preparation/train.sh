rm labels/*.txt
rm bad.list
node index.js
/software/darknet/darknet detector train cfg/dataset.data cfg/yolov3-voc.cfg darknet53.conv.74 -gpus 0

