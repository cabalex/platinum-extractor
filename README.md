# [platinum-extractor](https://cabalex.github.io/platinum-extractor)
A powerful web-based extractor for extracting and modding Platinum Games' games. It runs entirely in your browser-- no need to install anything!

A spiritual successor to [Astral Extractor](https://cabalex.github.io/astral-extractor).

#### [View JS Library ➡](https://github.com/cabalex/platinum-extract)

## Issues/Feature Requests
If you find any major bugs or features you would like to see, don't hesitate to open an issue on GitHub. Please note I may not be able to get around to everything, nor do I own every game or can make every file extractable/moddable, so be patient! If you know how to implement something, you can maybe even open a pull request.

## Development
This project is split into two parts-- the [JavaScript library platinum-extract](https://github.com/cabalex/platinum-extract) and the [front end platinum-extractor](https://github.com/cabalex/platinum-extractor), written in Svelte. They are designed to work in tandem, though the JavaScript library is there in case anyone wants to write scripts that use it. All file extraction and modding is done through the JavaScript library, so [visit that repository for any pull requests you make regarding file extraction](https://github.com/cabalex/platinum-extract).

How to get started:
1. Clone both repositories into **separate directories**.
2. Run `npm install` in both directories.
3. Create a hard symlink from `platinum-extractor/public/platinum-extract` to `platinum-extract/dist/`. (In Windows it's `mklink /J <link> <target>`.)
4. You should be good to go! Open two terminals and run `npm run dev` on platinum-extractor and `npm run start` on platinum-extract to start developing.

My code is not the highest quality. Sorry.

## Thanks
- Icons by Icons8
- Kerilk's [bayonetta-tools](https://github.com/Kerilk/bayonetta_tools/)
- kohos' [CriTools](https://github.com/kohos/CriTools) (CPK extraction)
- Platinum Games (thanks for making cool games)