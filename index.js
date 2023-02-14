const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// CONCEPT: Schema
// models
const TodoTask = require("./models/TodoTask");

dotenv.config();

// CONCEPT: Middleware
app.use("/static", express.static("public"));

// CONCEPT: Middleware
// urlencoded allows us to extract data from the form by adding it to the body property of the request
app.use(express.urlencoded({ extended: true }));

// connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    // Dedicate a port # & tell our express app to listen to that port
    app.listen(3000, () => console.log("Server up and running"));
})

// CONCEPT: Template Engine
// view engine configuration
app.set("view engine", "ejs");

// CONCEPT: Routing
app.get('/', (req,res) => {
    // Read from the database
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// CONCEPT: Routing
// For creating tasks
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// CONCEPT: Routing
// For editing tasks
app
.route("/edit/:id")
.get((req, res) => {
    const id = req.params.id;

    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id })
    })
})
.post((req, res) => {
    // update the task
    const id = req.params.id;
    
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);

        res.redirect("/");
    })
});

// CONCEPT: Routing
// For deleting tasks
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;

    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);

        res.redirect("/");
    });
});
