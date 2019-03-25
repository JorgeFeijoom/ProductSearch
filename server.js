// Get dependencies
const express = require('express');
const app = express();
const axios = require('axios');

// Test
app.get('/api/test', function (req, res) {
  res.send('This was a sample request');
});

// Search results
const myAppID = 'Dhananja-Assignme-PRD-316e081a6-a75d9f0b';
app.get('/api/findproducts', function (req, res) {

  let paramsObj = {
    "OPERATION-NAME": "findItemsAdvanced",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": myAppID,
    "RESPONSE-DATA-FORMAT": "JSON",
    "RESTPAYLOAD": null,
    "paginationInput.entriesPerPage": 50
  };

  /*
  http://svcs.ebay.com/services/search/FindingService/v1?OPERATIONNAME=findItemsAdvanced&SERVICE-VERSION=1.0.0
  &SECURITY-APPNAME=[APPID]&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50
  &keywords=iphone&buyerPostalCode=90007
  &itemFilter(0).name=MaxDistance&itemFilter(0).value=10&itemFilter(1).name=FreeShipping
  Only&itemFilter(1).value=true&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=true
  &itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condit
  ion&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecif
  ied&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo

  */

  const keywords = req.query.keywords;
  if (keywords) {
    paramsObj["keywords"] = keywords;
  }
  // make appropiate changes here
  const postalCode = req.query.postalCode;
  if (postalCode) {
    paramsObj["buyerPostalCode"] = postalCode;
  }

  let i= 0;

  const distance = req.query.distance;
  if (distance) {
    paramsObj["itemFilter("+i+").name=MaxDistance"];
    paramsObj["itemFilter("+i+").value"] = distance;
    i++;
  }

  const freeshipping = req.query.freeshipping;
  if (freeshipping) {
    paramsObj["itemFilter("+i+").name=FreeShippingOnly&itemFilter("+i+").value"] = freeshipping;
    i++;
  }

  const localpickup = req.query.localpickup;
  if (localpickup) {
    paramsObj["itemFilter("+i+").name=LocalPickupOnly"];
    paramsObj["itemFilter("+i+").value"] = localpickup;
    i++;
  }

  paramsObj["itemFilter("+i+").name=HideDuplicateItem"]
  paramsObj["itemFilter("+i+").value"] = true;
  i++;

  let j= 0;

  let condNew = req.query.conditionNew;
  if (condNew) {
    paramsObj["itemFilter("+i+").name"] = "Condition";
    paramsObj["itemFilter("+i+").value("+j+")"] = condNew;
    j++;
  }

  let condUsed = req.query.conditionUsed;
  if (condUsed) {
    paramsObj["itemFilter("+i+").name"] = "Condition";
    paramsObj["itemFilter("+i+").value("+j+")"] = condUsed;
    j++;
  }

  let condUnspecified = req.query.conditionUnspecified;
  if (condUnspecified) {
    paramsObj["itemFilter("+i+").name"] = "Condition";
    paramsObj["itemFilter("+i+").value("+j+")"] = condUnspecified;
    j++;
  }
  
  
    
  


  // HTTP Request
  axios.get('http://svcs.ebay.com/services/search/FindingService/v1', {
    params: paramsObj
  })
    .then(function (response) {

      // handle success
      // console.log(response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      console.log('Error in eBay API results', error);
      res.send(error);
    })
});

// Test
// app.get('*', function (req, res) {
//   res.send('All requests go here by default');
// });

// Tell Express to listen for requests (start server)
const port = process.env.PORT || '3000';
app.listen(port, function () {
  console.log('Server started on port', port);
});