const express = require("express");
const axios = require("axios");

const app = express();

const matchurl = (url) => {
  var expression =
    "/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}.[a-z]{2,4}\b(/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi";
  var regex = new RegExp(expression);
  if (url instanceof Array) {
    url.map((u) => {
      if (!u.match(regex)) {
        return false;
      }
    });
    return true;
  } else {
    if (!url.match(regex)) {
      return false;
    }
    return true;
  }
};

app.get("/numbers", async (req, res) => {
  const { url } = req.query;
  try {
    if (url) {
      if (!matchurl(url)) {
        throw "Url not Matching";
      }
      if (url instanceof Array) {
        const urls = url.map((u) => axios.get(u));
        let result = await Promise.all(urls);
        let numbers = [];
        const data = result.map((res) => {
          numbers.push(res.data.numbers);
        });
        numbers = numbers.flat(1);
        numbers = [...new Set(numbers.sort((a,b)=>a-b))];
        return res.json({ numbers });
      }
    } else {
      throw "Query Not matching ";
    }
  } catch (err) {
    res.json({ message: err });
  }
});

app.listen(3000, (err) => {
  if (err) throw error;
  console.log("Server created Sucessfully at port ", 3000);
});
