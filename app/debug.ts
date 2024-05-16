import { Lookup, lookup } from "geoip-lite";

// var geoip, {Lookup} = require('geoip-lite');

const location: Lookup | null = lookup("105.112.17.207")
console.log("Location: ", location)