set -e

rm -rf validation_labels
rm -rf aws_labels

mkdir ./validation_labels
mkdir ./aws_labels

node index.js

./upload.sh
