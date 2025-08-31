# Car Images Directory

This directory contains images for car cards in the Car Tracker application.

## Image Requirements

- **Format**: WebP preferred (smaller file size, better quality), JPG, PNG, or SVG also supported
- **Size**: Recommended 400x300 pixels (4:3 aspect ratio)
- **File size**: Keep under 200KB for optimal loading
- **Naming**: Use lowercase with descriptive names (e.g., sedan.webp, suv.jpg)
- **Transparent Background**: WebP and PNG support transparency for better visual integration

## Available Images

The following image files are expected by the application:

1. `default.webp` - Default fallback image (recommended with transparent background)
2. `sedan.jpg` - For sedan vehicles
3. `suv.jpg` - For SUV vehicles
4. `truck.jpg` - For pickup trucks
5. `hatchback.jpg` - For hatchback vehicles
6. `coupe.jpg` - For coupe vehicles
7. `convertible.jpg` - For convertible vehicles
8. `wagon.jpg` - For station wagons
9. `crossover.jpg` - For crossover vehicles
10. `sports.jpg` - For sports cars
11. `luxury.jpg` - For luxury vehicles

## Adding New Images

1. Save your image file in this directory (`public/images/cars/`)
2. Update the `CAR_IMAGES` array in `src/pages/Cars.tsx`
3. Use descriptive filenames that match the car type
4. For best results, use WebP format with transparent backgrounds

## Image Sources

You can use:
- Stock photos from free sites like Unsplash, Pexels, or Pixabay
- Car manufacturer press photos
- Your own vehicle photos
- Car silhouettes or illustrations with transparent backgrounds

Make sure to use royalty-free images or images you have permission to use.

## Converting to WebP

To convert existing images to WebP format:
- Online tools: Squoosh.app, CloudConvert
- Command line: `cwebp input.jpg -o output.webp`
- Photoshop: Export As > WebP
