var mongoose = require('mongoose')

mongoose.connect('mongodb+srv://famehuntdeveloper:dU6jZwvc3SmHMmm@agshin-cluster.8pqs6.mongodb.net/tahminmaster?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB!')
}).catch( (err) => {
    console.log('Failed' + err)
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose;


// const mongoose = require('mongoose');

// async function connectDatabase() {
//     await mongoose.connect('mongodb+srv://famehuntdeveloper:dU6jZwvc3SmHMmm@agshin-cluster.8pqs6.mongodb.net/tahminmaster?retryWrites=true&w=majority', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true
//     }).catch((err) => {
//         console.log(err);
//     });
// }

// module.exports = connectDatabase;