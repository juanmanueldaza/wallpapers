#!/bin/bash

for file in dist/pictures/*.jpg; do
    base="${file##dist/pictures/}"  #Extract filename, removing path prefix
    convert "$file" -resize "640x>" "dist/pictures/${base}-small.webp"
    convert "$file" -resize "1024x>" "dist/pictures/${base}-medium.webp"
    convert "$file" -resize "1920x>" "dist/pictures/${base}-large.webp"
    cp "$file" "dist/pictures/${base}-xlarge.jpg"
done
