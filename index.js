const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

// urlencoded allows us to extract data from the form by adding it to the body property of the request
app.use(express.urlencoded({ extended: true }));

// connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    // Dedicate a port # & tell our express app to listen to that port
    app.listen(3000, () => console.log("Server up and running"));
})


// view engine configuration
app.set("view engine", "ejs");

app.get('/', (req,res) => {
    // Read from the database
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

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

// For editing tasks
app
.route("/edit/:id")
.get((req, res) => {
    // find the id and render the new template
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

// For deleting tasks
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;

    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);

        res.redirect("/");
    });
});
