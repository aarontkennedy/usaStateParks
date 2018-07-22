# USA => State Parks

This project is two parts.  First, it scrapes wikipedia for all the state parks in the US.  I then augment that data with lat/lng info from Google Maps API.

Second, I make this data available via an http API.  I have a road trip app that can make use of this data.  The best part is that the parks will be searchable by location (lat/lng).  

It is live at https://usastateparks.herokuapp.com .

## Installation

Clone this repo.  You will need to set keys or environment variables for Mongo and Google Maps API. The environmental variables are called googleAPIkey and MONGODB_URI.
