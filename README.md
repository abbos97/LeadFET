LEADTOOLS Document Compare demo.  This demo contains functionality for comparing text and raster content.

## Note
This demo requires NodeJS to be installed on your machine.  If you don't have Node installed, you can get the latest release [here](https://nodejs.org/en/)

## Running
Make sure to run `npm install` to pull in project dependencies.

Make sure to perform the following:
   1. Copy all LEADTOOLS javascript files to the `./static/LT` directory.

We included a batch script to copy all of the LEADTOOLS dependency files:
   1. `npm run update`

To run the development version of the project:
   1. `npm run start`

This will run a development server hosted from the `static` directory in the project root.  This folder also contains a `config.json` file that will let you configure default functionality for the demo.

To build a deployable version of the demo:
   1. `npm run build`
   2. The `./static` directory will contain a shippable version of the demo.  Place it in IIS or wherever you plan on hosting the example.