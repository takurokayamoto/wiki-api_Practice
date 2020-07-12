const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database
/////////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });
const wikiSchma = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("Article", wikiSchma);

// let test1 = new Article ({
//     title: "mongoDB",
//     content:"mongoDB is very useful Database."
// })

// test1.save()

/////////////////////////////////////////

//SET UP DONE
//////////////////////////////////////

app.get("/", function (req, res) {
    res.render("test");
});

///////////////////////////////////////////////
////Request Targeting All Articles////
app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundItems) {
            if (!err) {
                res.send(foundItems);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const title = req.body.title;
        const content = req.body.content;

        const newArticle = new Article({
            title: title,
            content: content,
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("successfully added a new article");
            } else {
                res.semd(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("successfully deleteted all articles");
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////////////////////
////Request Targeting All Articles////
app.route("/articles/:articleTitle")

    .get(function (req, res) {
        const articleTitle = req.params.articleTitle;
        Article.findOne({ title: articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("<h1>No Article Found</h1>");
            }
        });
    })

    .put(function (req, res) {
        // contents をアップデートするときに使用。項目を指定しない場合は、全て消される。
        //下記の場合新しいtitle と contentを送らなくてはいけない。
        //　送らない場合は空欄になる
        const articleTitle = req.params.articleTitle;
        const title = req.body.title;
        const content = req.body.content;
        Article.update({ title: articleTitle }, { title: title, content: content }, { overwrite: true }, function (err) {
            if (!err) {
                res.send("Successfully updated!");
            }
        });
    })
    .patch(function (req, res) {
        // req.body = {
        //     title: "~~~",
        //     content: "~~~"
        // }

        const articleTitle = req.params.articleTitle;

        Article.update({ title: articleTitle }, { $set: req.body }, function (err, results) {
            if (!err) {
                res.send("successfully updated with patch");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        const articleTitle = req.params.articleTitle;
        Article.deleteOne({ title: articleTitle }, function (err) {
            if (!err) {
                res.send("Successfully deleted" + articleTitle);
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////////////////////

// app.get("/articles", function (req, res) {
//     Article.find({}, function (err, foundItems) {
//         if (!err) {
//             res.send(foundItems);
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.post("/articles", function (req, res) {
//     const title = req.body.title;
//     const content = req.body.content;

//     const newArticle = new Article({
//         title: title,
//         content: content,
//     });
//     // newArticle.save(function (err) {
//     //     if (!err) {
//     //         res.send("successfully added a new article");
//     //     } else {
//     //         res.semd(err);
//     //     }
//     // });
// });

// app.delete("/articles", function (req, res) {
//     Article.deleteMany(function (err) {
//         if (!err) {
//             res.send("successfully deleteted all articles")
//         } else {
//             res.send(err)
//         }
//      })
//  });

app.listen(3000, function () {
    console.log("Server is up on 3000");
});
