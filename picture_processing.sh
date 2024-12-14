#!/bin/bash

# Determine environment and set directory
if [ "$NODE_ENV" = "production" ]; then
    PICTURES_DIR="dist/pictures"
else
    PICTURES_DIR="public/pictures"
fi

# Create directory if it doesn't exist
mkdir -p "$PICTURES_DIR"

# Process each image individually
find "$PICTURES_DIR" -name "*.jpg" -print0 | while IFS= read -r -d $'\0' file; do
    base="${file##*/}"
    dir="${file%/*}"

    #Error Handling
    if convert "$file" -resize 640x "${dir}/${base%.*}-small.webp"; then
        echo "Conversion to small WebP successful: $file"
    else
        echo "Error converting to small WebP: $file" >&2
    fi

    if convert "$file" -resize 1024x "${dir}/${base%.*}-medium.webp"; then
        echo "Conversion to medium WebP successful: $file"
    else
        echo "Error converting to medium WebP: $file" >&2
    fi
done
