const express = require("express");
const router = express.Router();

var convertHandler = new ConvertHandler();
function ConvertHandler() {
  this.getNum = function (input) {
    let result;
    regObj = input.match(/[\d]+[\/|\.]*[\d]*[\/|\.]*[\d]*/);

    if (!regObj) {
      return 1;
    }
    let nums = regObj[0];
    if (
      (nums.match(/\//g) || []).length > 1 ||
      (nums.match(/\./g) || []).length > 1
    ) {
      return "invalid number";
    }
    result = eval(nums);
    if (isNaN(result)) {
      return "invalid number";
    }
    //console.log(result)
    return result;
  };

  this.getUnit = function (input) {
    let result;
    let possibleUnits = [
      "gal",
      "l",
      "mi",
      "km",
      "lbs",
      "kg",
      "GAL",
      "L",
      "MI",
      "KM",
      "LBS",
      "KG",
    ];
    regObj = input.match(/[a-zA-Z]+/);
    if (!possibleUnits.includes(regObj[0])) {
      result = "invalid unit";
    } else {
      result = regObj[0].toLowerCase();
    }
    return result;
  };

  this.getReturnUnit = function (initUnit) {
    let result;
    if (initUnit == "invalid unit") {
      return initUnit;
    }
    let input = ["gal", "l", "mi", "km", "lbs", "kg"];
    let output = ["l", "gal", "km", "mi", "kg", "lbs"];
    for (i in input) {
      if (input[i] == initUnit.toLowerCase()) {
        result = output[i];
      }
    }

    return result;
  };

  this.spellOutUnit = function (unit) {
    let result;
    let input = ["gal", "l", "mi", "km", "lbs", "kg"];
    let output = [
      "gallon(s)",
      "litre(s)",
      "mile(s)",
      "kilometre(s)",
      "pound(s)",
      "kilogram(s)",
    ];
    for (i in input) {
      if (input[i] == unit.toLowerCase()) {
        result = output[i];
      }
    }
    return result;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    conversionTable = {
      gal: galToL,
      l: 1 / galToL,
      mi: miToKm,
      km: 1 / miToKm,
      lbs: lbsToKg,
      kg: 1 / lbsToKg,
    };

    let result = initNum * conversionTable[initUnit];

    return result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${initUnit} converts to ${returnNum.toFixed(
      5
    )} ${this.spellOutUnit(returnUnit)}`;
    console.log(result);
    return result;
  };
}
router.get("/api/convert", function (req, res) {
  var input = req.query.input;
  var initNum = convertHandler.getNum(input);
  var initUnit = convertHandler.getUnit(input);
  if (initNum == "invalid number" && initUnit == "invalid unit") {
    res.json("invalid number and unit");
  }

  if (initNum == "invalid number") {
    res.json("invalid number");
  }

  if (initUnit == "invalid unit") {
    res.json("invalid unit");
  }
  var returnNum = eval(convertHandler.convert(initNum, initUnit).toFixed(5));
  var returnUnit = convertHandler.getReturnUnit(initUnit);
  var toString = convertHandler.getString(
    initNum,
    initUnit,
    returnNum,
    returnUnit
  );

  var resJson = {};
  resJson["initNum"] = initNum;
  resJson["initUnit"] = initUnit;
  resJson["returnNum"] = returnNum;
  resJson["returnUnit"] = returnUnit;
  resJson["string"] = toString;

  //res.json
  res.json(resJson);

  //res.json
});

module.exports = router;