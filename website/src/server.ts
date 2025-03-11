import { existsSync } from "fs";
import express from "express";
import { join } from "path";

const app = express();

app.get("/", (req, res) => {
    return res.sendFile(join(__dirname, "../static/index.html"));
});

app.get("*", (req, res) => {
    const path = join(__dirname, "../static", req.path);

    console.log(path);

    if (!existsSync(path)) {
        res.sendStatus(404);
        return;
    }

    res.sendFile(path);
});

app.listen(3000, () => {
    console.log("Listening.");
});