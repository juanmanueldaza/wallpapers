#!/bin/bash

for file in dist/pictures/*.jpg; do
    base="${file##dist/pictures/}"  #Extract filename, removing path prefix
    convert "$file" -resize "640x>" "dist/assets/pictures/${base}-small.webp"
    convert "$file" -resize "1024x>" "dist/assets/pictures/${base}-medium.webp"
    convert "$file" -resize "1920x>" "dist/assets/pictures/${base}-large.webp"
    cp "$file" "dist/pictures/${base}-xlarge.jpg"
done
