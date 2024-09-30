const mongoose = require('mongoose')

const dbUri = 'mongodb+srv://s220194805:nC0IFkpgBCS1fp0q@cluster0.k3wz2.mongodb.net/'


module.exports = () => mongoose.connect(dbUri)