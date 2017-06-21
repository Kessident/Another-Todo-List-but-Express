const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const jsonfile = require('jsonfile');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static("public"));
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

let file = "todoList.json";
let todoObj;
let todoList;
let todoCompleted;
jsonfile.readFile(file, function(err, obj) {
  todoList = obj.todoList;
  todoCompleted = obj.completeItems;
});


app.get("/",function (req,res) {
  res.render("index",{todos: todoList,todoFin: todoCompleted});
});

app.post("/",function (req,res) {
  if (req.body.todo){
    todoList.push(req.body.todo);
  } else if (req.body.complete) {
    todoList.splice(todoList.indexOf(req.body.complete),1);
    todoCompleted.push(req.body.complete);
  }



  let obj = {
    todoList: todoList,
    completeItems: todoCompleted
  };
  jsonfile.writeFile(file, obj, function (err) {
    if (err){
      console.error("error writing file: ",err);
    }
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server running on localhost:3000");
});
