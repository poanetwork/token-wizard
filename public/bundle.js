(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
    replaceall (v0.1.6) 23-04-2015
    (c) Lee Crossley <leee@hotmail.co.uk> (http://ilee.co.uk/)
*/
var replaceall=function(a,b,c){return b=b.replace(/\$/g,"$$$$"),c.replace(new RegExp(a.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,"\\$&"),"g"),b)};"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=replaceall),exports.replaceall=replaceall);
},{}],2:[function(require,module,exports){
//let web3 = require("web3");
let reaplaceAll = require("replaceall");

//window.web3 = web3;
window.reaplaceAll = reaplaceAll;
},{"replaceall":1}]},{},[2]);
