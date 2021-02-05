const express = require("express");
const { db, query } = require("../database");
const router = express.Router();
const { createJWTToken, hashPassword } = require("../helper");

router.post("/register", async (req, res) => {
	const { username, password, email } = req.body;
	const { uid } = Date.now();
	password = hashPassword(password);
	try {
		const insert = await query(
			`INSERT INTO users (uid, username, email, password, alamat, role, status) VALUES ('${uid}','${username}', '${email}', '${password}', 2, 1)`
		);
		const select = await query(
			`SELECT id, uid, username, email FROM users WHERE id = ${insert.insertId}`
		);
		const responseData = { ...select[0] };
		responseData.token = createJWTToken(responseData);
		return res.status(200).send(responseData);
	} catch (err) {
		return res.status(500).send(err.message);
	}
});

router.post("/login", (req, res) => {
	const { username, email, password } = req.body;
	if ((username || email) && password) {
		let sql = `
    SELECT 
        id, 
        uid,
        username, 
        email, 
        alamat, 
        role, 
        status 
        FROM users WHERE (email = '${email}' OR username = '${username}') AND password = '${hashPassword(
			password
		)}'`;
		db.query(sql, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			if (data.length === 0) {
				return res.status(404).send({
					message: "User Not Found",
					status: "Not Found",
				});
			} else {
				const responseData = { ...data[0] };
				const token = createJWTToken(responseData);
				responseData.token = token;
				return res.status(200).send(responseData);
			}
		});
	}
});

router.put("/activate", async (req, res) => {
	try {
		const { token } = req.body;
		const activatesql = `update users set status = active where id = ${token} `;
		await query(activatesql);
		res.send({ status: "active" });
	} catch (err) {
		res.send(err);
	}
});

router.put("/deactive", async (req, res) => {
	try {
		const { token } = req.body;
		const activatesql = `update users set status = deactive where id = ${token} `;
		await query(activatesql);
		res.send({ status: "deactive" });
	} catch (err) {
		res.send(err);
	}
});
module.exports = router;
