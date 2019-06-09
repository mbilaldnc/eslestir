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

app.get('/names', (req, res) => {
	db.find({}, (err, docs) => {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
});

app.get('/names/A', (req, res) => {
	db.find({ group: 'A' }, (err, docs) => {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
});

app.get('/names/B', (req, res) => {
	db.find({ group: 'B' }, (err, docs) => {
		if (err) {
			console.log(err);
		}
		res.json(docs);
	});
});

app.post('/names', (req, res) => {
	var data = req.body;
	db.insert(data, (err, newDoc) => {
		if (err) {
			console.log(err);
		}
		res.send('Veri başarıyla kaydedildi!');
	});
});

app.get('/name/:id', (req, res) => {
	db.findOne({ _id: req.params.id }, (err, found) => {
		if (err) {
			console.log(err);
		}
		res.json(found);
	});
});

app.post('/name/delete/:id', (req, res) => {
	db.remove({ _id: req.params.id }, {}, function(err, numRemoved) {
		if (err) {
			console.log(err);
		}
		res.send('Veri başarıyla silindi!');
	});
});

app.post('/name/update/:id', (req, res) => {
	db.update({ _id: req.params.id }, { $set: req.body }, {}, function(err, numRemoved) {
		if (err) {
			console.log(err);
		}
		res.send('Veri başarıyla güncellendi!');
	});
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
