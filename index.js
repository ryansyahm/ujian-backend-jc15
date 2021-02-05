const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const bearerToken = require("express-bearer-token");

// main app
const { userRouter, moviesRouter } = require("./router");

// apply middleware
app.use(cors());
app.use(bodyparser.json());
app.use(bearerToken());

// main route
// app.get("/", (req, res) => {
// 	res.status(200).send("<h1>REST API JCWM-15</h1>");
// });

app.get("/user", userRouter);
app.get("/movies", moviesRouter);

// bind to local machine
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => `CONNECTED : port ${PORT}`);

// const express = require("express");
// const app = express();
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const port = 2000;

// const { productRouter, storeRouter, soal3 } = require("./router");

// app.use(bodyParser());
// app.use(cors());
// app.use(express.static("public"));

// app.get("/", (req, res) => {
// 	res.status(200).send("<h1>Express API</h1>");
// });

// app.use("/product", productRouter);
// app.use("/store", storeRouter);
// app.use("/soal3", soal3);

// app.listen(port, () => console.log(`API active at port ${port}`));
