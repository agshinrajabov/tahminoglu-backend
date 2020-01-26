var mongoose = require('mongoose')

mongoose.connect('mongodb://QedirHuseynov4646:qedir3373077h@ds213079.mlab.com:13079/tahminmaster', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB!')
}).catch( (err) => {
    console.log('Failed' + err)
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
