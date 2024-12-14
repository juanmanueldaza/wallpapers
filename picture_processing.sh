#!/bin/bash

find dist/pictures -name "*.jpg" -print0 | while IFS= read -r -d $'\0' file; do
    base="${file##dist/pictures/}"
    if convert "$file" -resize 640x "${file%.*}-small.webp"; then
        echo "Conversion to small WebP successful: $file"
    else
        echo "Error converting to small WebP: $file" >&2 #Send error to stderr
    fi
    cp "$file" "${file%.*}-xlarge.jpg"
done
