const postgres = require('pg');
const sampleData = require('../sampleData/sampleData.js');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tableopen';

const client = new postgres.Client({
	connectionString: connectionString,
	// ssl: true
});

client.connect();

// create schema for restaurants
client.query("DROP TABLE restaurants");
client.query(`CREATE TABLE IF NOT EXISTS restaurants (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	category VARCHAR(255),
	address VARCHAR(255),
	city VARCHAR(255),
	state VARCHAR(255),
	zip VARCHAR(255),
	url VARCHAR(255),
	image VARCHAR(255),
	phone VARCHAR(255),
	reviews INT,
	rating DECIMAL
)`);

// create schema for reservations
client.query("DROP TABLE reservations");
client.query(`CREATE TABLE IF NOT EXISTS reservations (
		id SERIAL PRIMARY KEY,
		restaurant_id INT,
		time VARCHAR(255),
		party_size INT,
		customer_id INT DEFAULT NULL,
		status BOOLEAN DEFAULT FALSE
)`);

client.query(`INSERT INTO reservations VALUES (DEFAULT, 16, 'now', 15, DEFAULT, DEFAULT) RETURNING *`)
.then((results) => {
	// console.log(`reservations has something in it: ${JSON.stringify(results, null, 2)}`);
	});




const SEED_SAMPLE_DATA = () => {
  sampleData.massagedDataYelp.businesses.forEach((example) => {
		client.query(`
			INSERT 
			INTO restaurants 
			VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`, 
			 [example.name, example.categories[0].title, example.location.address1 + ' ' + example.location.address2 + ' ' + example.location.address3, example.location.city, example.location.state, example.location.zip_code, example.url, example.image_url, example.display_phone, example.review_count, example.rating]
		);
		// client.query(" INSERT INTO restaurants VALUES (DEFAULT, ${name}, ${categories[0].title}, ${location.address1 + location.address2 + location.address3}, ${location.city}, ${location.state}, ${location.zip_code}, ${url}, ${image_url}, ${display_phone}, ${review_count}, ${rating})", example);
  });
}

		// .then((resultingID) => {
		// 	console.log(`this id was: ${JSON.stringify(resultingID, null, 2)}`);
		// 	console.log('this posts after a restaurant is entered');
		// 	example.reservations.forEach(booking => {
		// 		// console.log(JSON.stringify(booking));
		// 		let vals = [resultingID.rows[0].id, booking.time, booking.people];
		// 		// console.log('this posts after a reservation is created/inserted');
		// 		// client.query(`INSERT INTO reservations VALUES (DEFAULT, 16, 'now', 15, DEFAULT, DEFAULT) RETURNING *`);
		// 		// client.query(`
		// 		// 	INSERT INTO reservations
		// 		// 	VALUES (DEFAULT, $1, $2, $3, DEFAULT, DEFAULT)`,
		// 		// 	vals
		// 		// );
		// 		// .then((result) => {
		// 		// 	console.log('how many times dis print');
		// 		// });
		// 	})
		// 	.catch((error) => {
		// 		console.log('error: ', error);
		// 	});


Promise.resolve(SEED_SAMPLE_DATA())

.then(() => {
client.query(
	// `
	// SELECT restaurants.name, reservations.time, reservations.party_size
	// FROM reservations, restaurants
	// WHERE reservations.restaurant_id = restaurants.id`
	'SELECT * FROM restaurants'

	)

	.then((results) => {
		console.log(JSON.stringify(results.rows, null, 2));
		client.end();
	})
	.catch((error) => {
    console.log(`ERROR FROM DB QUERY: ${error}`);
    client.end();
	});
});