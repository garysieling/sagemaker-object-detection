#/software/darknet/darknet detect cfg/yolov3.cfg yolov3.weights data/dog.jpg
/software/darknet/darknet detect cfg/dataset.data cfg/yolov3-voc.cfg darknet53.conv.74 $(ls labels/ | grep jpg$ | shuf | head -n 1) -gpus 0 
