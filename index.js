import express from 'express';
import sqlite3 from "sqlite3";

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the database.");
    }
});

let sql = `CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
    )`;

db.run(sql, (err)=>{
    if (err) {
        console.error("Error creating table: " + err.message);
    } else {
        console.log("Table created");
    }
});

app.get("/students", (req, res) => {
    let sql = "SELECT * FROM students";
    db.all(sql, (err, rows) => {
        if (err) {
            console.error("Error fetching students: " + err.message);
            res.status(500).send("Error fetching students");
        } else {
            res.json(rows);
        }
    });
});

app.get("/students/:id",(req,res)=>{
    let sql="SELECT * FROM students WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error("Error fetching student: " + err.message);
            res.status(500).send("Error fetching student");
        } else {
            if (!row) {
                return res.status(404).send("Student not found");
            }
            res.json(row);
        }
    });
});

app.post("/students", (req, res) => {
    let sql = "INSERT INTO students (name, age) VALUES (?, ?)";
    let params = [req.body.name, req.body.age];
    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error adding student: " + err.message);
            res.status(500).send("Error adding student");
        } else {
            let sql2="SELECT * FROM students WHERE id = ?"

            db.get(sql2, [this.lastID], (err, row) => {
                if (err) {
                    console.error("Error fetching new student: " + err.message);
                    res.status(500).send("Error fetching new student");
                } else {
                    res.status(201).send(row);
                }
            });
        }
    });
});

app.put("/students/:id", (req, res) => {
    let sql = "UPDATE students SET name = ?, age = ? WHERE id = ?";
    let params = [req.body.name, req.body.age, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error updating student: " + err.message);
            res.status(500).send("Error updating student");
        } else {
            
            if (this.changes === 0) {
                return res.status(404).send("Student not found");
            }
            let sql2 = "SELECT * FROM students WHERE id = ?";

            db.get(sql2, [req.params.id], (err, row) => {
                if (err) {
                    console.error("Error fetching updated student: " + err.message);
                    res.status(500).send("Error fetching updated student");
                } else {
                    res.json(row);
                }
            });
        }
    });
});

app.patch("/students/:id", (req, res) => {
    let sql = "UPDATE students SET name = ?, age = ? WHERE id = ?";
    let params = [req.body.name, req.body.age, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error updating student: " + err.message);
            res.status(500).send("Error updating student");
        } else {
            
            if (this.changes === 0) {
                return res.status(404).send("Student not found");
            }
            let sql2 = "SELECT * FROM students WHERE id = ?";

            db.get(sql2, [req.params.id], (err, row) => {
                if (err) {
                    console.error("Error fetching updated student: " + err.message);
                    res.status(500).send("Error fetching updated student");
                } else {
                    res.json(row);
                }
            });
        }
    });
});

app.delete("/students/:id", (req, res) => {
    let sql = "DELETE FROM students WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            console.error("Error deleting student: " + err.message);
            res.status(500).send("Error deleting student");
        } else {
            if (this.changes === 0) {
                return res.status(404).send("Student not found");
            }
            res.status(204).send();
        }
    });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});



