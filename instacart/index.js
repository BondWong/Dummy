const util = require('util');
const request = require("request-promise");

async function get() {
  const options = {
    uri: 'https://postman-echo.com/get',
    port: 443,
    json: true,
    qs: {
        foo1: 'bar1',
        foo2: 'bar2',
    },
    headers: { 'User-Agent': 'Request-Promise' }
  };

  try {
    const response = await request(options);
    console.log(response);
  } catch(error) {
    console.error(error);
  }
}

async function post() {
  const options = {
    uri: 'https://postman-echo.com/post',
    port: 443,
    method: 'POST',
    json: true,
    body: { some: 'post payload' },
    headers: { 'User-Agent': 'Request-Promise' }
  }

  try {
    const response = await request(options);
    console.log(response);
  } catch(error) {
    console.error(error);
  }
}

async function put() {
  const options = {
    uri: 'https://postman-echo.com/put',
    port: 443,
    method: 'PUT',
    json: true,
    body: { some: 'put payload' },
    headers: { 'User-Agent': 'Request-Promise' }
  }

  try {
    const response = await request(options);
    console.log(response);
  } catch(error) {
    console.error(error);
  }
}

async function deleteFn() {
  const options = {
    uri: 'https://postman-echo.com/delete',
    port: 443,
    method: 'DELETE',
    json: true,
    qs: { foo: 'bar' },
    headers: { 'User-Agent': 'Request-Promise' }
  }

  try {
    const response = await request(options);
    console.log(response);
  } catch(error) {
    console.error(error);
  }
}

get();
post();
put();
deleteFn();
