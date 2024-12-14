#!/bin/bash

find dist/pictures -name "*.jpg" -print0 | while IFS= read -r -d $'\0' file; do
    base="${file##dist/pictures/}"
    convert "$file" -resize 640x "${base}-small.webp"
    convert "$file" -resize 1024x "${base}-medium.webp"
    convert "$file" -resize 1920x "${base}-large.webp"
    cp "$file" "${base}-xlarge.jpg"
done
