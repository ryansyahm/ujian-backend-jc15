const express = require("express");
const router = express.Router();
const query = require("../database");
const { checkToken } = require("../helper");

router.get("/get/all", async (req, res) => {
	try {
		const sql = `SELECT
          m.name,
          m.release_date,
          m.release_month,
          m.release_year,
          m.duration_min,
          m.genre,
          m.description,
          ms.status,
          l.location,
          st.time
      from schedules s
      JOIN movies m ON m.id = s.movie_id
      JOIN movie_status ms ON ms.id = m.id
      JOIN locations l ON l.id = s.location_id
      JOIN show_times st ON st.id = s.time_id`;
		const data = await query(sql);
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/get", (req, res) => {
	let sql = `
      SELECT
        m.name,
        m.release_date,
        m.release_month,
        m.release_year,
        m.duration_min,
        m.genre,
        m.description,
        ms.status,
       l.location,
       st.time
      from schedules s
      JOIN movies m ON m.id = s.movie_id
      JOIN movie_status ms ON ms.id = m.id
      JOIN locations l ON l.id = s.location_id
      JOIN show_times st ON st.id = s.time_id`;
	if (req.query.status && req.query.location && req.query.time) {
		sql += ` WHERE status = '${req.query.status}' AND location = '${req.query.location}' AND time = ${req.query.time} `;
	} else if (req.query.status) {
		sql += ` WHERE status = '${req.query.status}'`;
	} else if (req.query.location) {
		sql += ` WHERE location = '${req.query.location}'`;
	} else if (req.query.time) {
		sql += ` WHERE time = '${req.query.time}'`;
	}
	query(sql, (err, data) => {
		if (err) {
			return res.status(500).send(err.message);
		}
		return res
			.status(200)
			.send({
				name: `'${req.body.name}'`,
				release_date: `${req.body.release_date}`,
				release_month: `${req.body.release_month}`,
				release_year: `${req.body.release_year}`,
				duration_min: `${req.body.duration_min}`,
				genre: `'${req.body.genre}'`,
				description: `'${req.body.description}'`,
				status: `'${req.body.status}'`,
				location: `'${req.body.location}'`,
			});
	});
});

router.post("/movies/add", checkToken, async (req, res) => {
	try {
		const {
			name,
			genre,
			release_date,
			release_month,
			release_year,
			duration_min,
			description,
		} = req.body;
		await query(`
    insert into movies (name, genre, release_date, release_month, release_year, duration_min, description, status) values
     ('${name}', '${genre}',${release_date},${release_month},${release_year},${duration_min},'${description}', 1)`);
		return res.status(200).send({ message: "Data Added", status: "Added" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

// Pakai locationId dan timeId
router.patch("/set/:id", checkToken, async (req, res) => {
	const { locationId, timeId } = req.body;
	try {
		const { id } = req.params;
		await query(`select * from schedule where id = ${id}`);
		const dataLoc = await query(`
    select * from locations where id = ${locationId}`);
		const dataTime = await query(`
    select * from show_times where id = ${timeId}`);
		const dataMovie = await query(`
    select * from movies where id = ${movie_id}`);
		const { location_id } = dataLoc[0];
		const { movie_id } = dataMovie[0];
		const { time_id } = dataTime[0];

		const updatesql = `
    update inventory set movie_id = ${movie_id}, location_id = ${location_id}, time_id = ${time_id} where id = ${id}`;
		await query(updatesql);
		res.send({ message: "Schedule Has Been Added" });
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
