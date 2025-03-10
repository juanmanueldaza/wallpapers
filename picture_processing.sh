#!/bin/bash

# Determine environment and set directory
if [ "$NODE_ENV" = "production" ]; then
    PICTURES_DIR="dist/pictures"
else
    PICTURES_DIR="public/pictures"
fi

# Create directory if it doesn't exist
mkdir -p "$PICTURES_DIR"

# Add debug output
echo "Processing images in directory: $PICTURES_DIR"

# Process each image individually
find "$PICTURES_DIR" -name "*.jpg" -print0 | while IFS= read -r -d $'\0' file; do
    base="${file##*/}"
    dir="${file%/*}"
    name="${base%.*}"

    echo "Processing file: $file"
    echo "Base name: $base"
    echo "Directory: $dir"
    echo "Name without extension: $name"

    # Rotate the image based on its EXIF orientation data
    if convert "$file" -auto-orient "$file"; then
        echo "Auto-orient successful: $file"
    else
        echo "Error auto-orienting: $file" >&2
    fi

    # Resize and convert to small WebP
    if convert "$file" -resize 640x "${dir}/${name}-small.webp"; then
        echo "Created small WebP: ${dir}/${name}-small.webp"
    else
        echo "Error creating small WebP: $file" >&2
    fi

    # Resize and convert to medium WebP
    if convert "$file" -resize 1024x "${dir}/${name}-medium.webp"; then
        echo "Created medium WebP: ${dir}/${name}-medium.webp"
    else
        echo "Error creating medium WebP: $file" >&2
    fi
done

# List all files after processing
echo "Files in directory after processing:"
ls -la "$PICTURES_DIR"
