const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// buildind schema for items
const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

app.get("/", function(req, res) {
  let today = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  today = today.toLocaleDateString("en-Us", options)

  // finding DB elements with named items
  Item.find({}, function(err, items) {
    if (err) {
      console.log(err);
    } else {
      // sayfayı renderla
      res.render("list", {
        listTitle: today,
        newItems: items
      });
    }
  })
})

app.post("/", function(req, res) {
  const addedItem = req.body.newItem;
  const item = new Item({
    name: addedItem
  });
  item.save();
  res.redirect("/");
})

app.post("/delete", function(req, res) {
  console.log(req.body.checkbox);
  // delete item from DB then redirect
  const deleteditemId = req.body.checkbox;
  Item.findByIdAndDelete(deleteditemId, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  })
})


app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
