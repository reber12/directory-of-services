import fs from 'fs';
import fetch from 'node-fetch';
import postLatLongData from './latLongBeforeFilter.json';
import latLong from './filteredLatLong.json';
import postcodes from './postcodes.json';

// I used this website live API: https://api.postcodes.io/, it allow to get lat and
// long for 100 postcode in an array

// Get postcodes from original data
function getPostcodes(data) {
  return data.map(orgs => orgs.branches)
    .map(item => item[0].Postcode)
    .filter((elem, index, self) => index === self.indexOf(elem) && elem.length > 0)
}

// Second option to postcode lat and long
function getOrgsLatAndLog() {
  return postcodes.map(post =>
    fetch(`https://api.postcodes.io/postcodes/?q=${post}`, { mode: 'no-cros' })
      .then(res => res.json())
      .then(res => console.log(res.result))
      .catch(err => console.log(err)))
}

// Get lat and long from API response data
function filterPostcodeLatLong() {
  return postLatLongData.map(data => {
    if (data.result) {
      const lat = data.result.latitude
      const long = data.result.longitude
      const Postcode = data.result.postcode
      return { Postcode, lat, long }
    }
    const Postcode = data.query
    return { Postcode, lat: '', long: '' }
  })
}

// Add lat and long to original data
function addLatLong(realData) {
  return realData.map(orgs =>
    orgs.branches.map(org => {
      const {
        Area, Organisation, Clients, Category, Email, project, tag, Website,
        Tel, Process, Postcode, Services, Borough, Day
      } = org;
      for (const post in latLong) {
        if (org.Postcode === latLong[post].Postcode) {
          const { lat } = latLong[post];
          const { long } = latLong[post];
          return {
            Area,
            Organisation,
            Clients,
            Category,
            Email,
            project,
            tag,
            Website,
            Tel,
            Process,
            Postcode,
            Services,
            Borough,
            Day,
            lat,
            long
          }
        }
      }
      return {
        Area,
        Organisation,
        Clients,
        Category,
        Email,
        project,
        tag,
        Website,
        Tel,
        Process,
        Postcode,
        Services,
        Borough,
        Day,
        lat: '',
        long: ''
      }
    }))
}

// Conver data that you added lat and long to, to orginal data stucture.
function orgStructure(organisations) {
  const newOrgs = [];
  const data = [];
  organisations
    .map(orgs =>
      orgs.map(item => {
        if (!newOrgs.includes(item.Organisation)) {
          newOrgs.push(item.Organisation);

          const temp = {};
          temp.name = item.Organisation;
          temp.count = 1;
          temp.branches = [];
          temp.branches.push(item);

          data.push(temp);
        } else {
          data.map((elem, index) => {
            if (elem.name === item.Organisation) {
              elem.count += 1;

              data[index].branches.push(item);
            }
            return null;
          });
        }
        return null;
      }))
  return data;
}

// Write the data into file as JSON format
function convertToJsonFile(data, fileName) {
  const stringData = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${fileName}.json`, stringData);
}

export default {
  getPostcodes,
  filterPostcodeLatLong,
  addLatLong,
  orgStructure,
  convertToJsonFile,
  getOrgsLatAndLog
}
