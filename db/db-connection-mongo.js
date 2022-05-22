const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = 'mongodb://vladimir:CgaZdpHlqSWGzLjU@cluster0-shard-00-00.08eed.mongodb.net:27017,cluster0-shard-00-01.08eed.mongodb.net:27017,cluster0-shard-00-02.08eed.mongodb.net:27017/dbInvents?ssl=true&replicaSet=atlas-ouijus-shard-0&authSource=admin&retryWrites=true&w=majority';
        await mongoose.connect(url);
        console.log('Conexion exitosa');
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = {
    getConnection,
}