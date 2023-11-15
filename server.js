const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let fruits = [{
        _id: 1,
        name: "Apple",
        color: "Red",
        taste: "Sweet",
        size: "Medium",
        origin: "USA",
        related_infos: ["Common in pies", "Varieties: Fuji, Granny Smith"],
    },
    {
        _id: 2,
        name: "Banana",
        color: "Yellow",
        taste: "Sweet",
        size: "Small",
        origin: "Tropical",
        related_infos: ["Good source of potassium", "Botanically classified as berries"],
    },
    {
        _id: 3,
        name: "Orange",
        color: "Orange",
        taste: "Citrusy",
        size: "Medium",
        origin: "Spain",
        related_infos: ["Rich in vitamin C", "Varieties: Navel, Valencia"],
    },
    {
        _id: 4,
        name: "Grapes",
        color: "Purple",
        taste: "Sweet",
        size: "Small",
        origin: "Italy",
        related_infos: ["Used to make wine", "Varieties: Red, Green"],
    },
    {
        _id: 5,
        name: "Watermelon",
        color: "Green",
        taste: "Sweet",
        size: "Large",
        origin: "USA",
        related_infos: ["Contains mostly water", "Popular summer fruit"],
    },
    {
        _id: 6,
        name: "Mango",
        color: "Yellow",
        taste: "Sweet",
        size: "Large",
        origin: "India",
        related_infos: ["National fruit of India", "Varieties: Alphonso, Haden"],
    },
];

app.get("/api/fruits", (req, res) => {
    res.send(fruits);
});

app.post("/api/fruits", upload.single("img"), (req, res) => {
    const result = validateFruit(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const fruit = {
        _id: fruits.length + 1,
        name: req.body.name,
        color: req.body.color,
        taste: req.body.taste,
        size: req.body.size,
        origin: req.body.origin,
        related_infos: req.body.related_infos.split(",")
    }

    fruits.push(fruit);
    res.send(fruits);
});

const validateFruit = (fruit) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        related_infos: Joi.allow(""),
        name: Joi.string().min(3).required(),
        color: Joi.string().min(3).required(),
        tatse: Joi.string().min(3).required(),
        size: Joi.string().min(3).required(),
        origin: Joi.string().min(3).required()
    });

    return schema.validate(fruit);
};

app.listen(3000, () => {
    console.log("Hello");
});