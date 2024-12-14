#!/bin/bash

# Process each image individually (most robust)
find public/pictures -name "*.jpg" -print0 | while IFS= read -r -d $'\0' file; do
    base="${file##public/pictures/}"
    #Error Handling
    if convert "$file" -resize 640x "${file%.*}-small.webp"; then
        echo "Conversion to small WebP successful: $file"
    else
        echo "Error converting to small WebP: $file" >&2
    fi
    if convert "$file" -resize 1024x "${file%.*}-medium.webp"; then
        echo "Conversion to medium WebP successful: $file"
    else
        echo "Error converting to medium WebP: $file" >&2
    fi
done
