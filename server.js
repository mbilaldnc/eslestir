const express = require('express'),
	app = express(),
	Datastore = require('nedb'),
	cors = require('cors');

var db = new Datastore({ filename: 'db.json' });
db.loadDatabase();

app.use(cors());
app.use(express.static('match-vars/dist'));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.get('/all', (req, res) => {
	db.find({}, (err, docs) => {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
});

app.post('/new', (req, res) => {
	var data = req.body;
	var doc = {
		name: data.name
	};
	db.insert(doc, (err, newDoc) => {
		if (err) {
			console.log(err);
		}
		res.send('Veri başarıyla kaydedildi!');
	});
});

app.get('/all/:id', (req, res) => {
	db.findOne({ _id: req.params.id }, (err, found) => {
		if (err) {
			console.log(err);
		}
		res.json(found);
	});
});

app.post('/delete/:id', (req, res) => {
	db.remove({ _id: req.params.id }, {}, function(err, numRemoved) {
		if (err) {
			console.log(err);
		}
		res.send('Veri başarıyla silindi!');
	});
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
