set -e
set -o xtrace

rm -rf temp
mkdir temp
ffmpeg -i $1/$2.mp4 -vf scale=500:500 temp/$2-%07d.jpg

node label_cheat.js $2

cp temp/* images/
