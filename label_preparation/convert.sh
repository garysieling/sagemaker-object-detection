#!/bin/bash
for filename in validation/*.jpg; do
  echo $filename
  convert $filename $filename
done
