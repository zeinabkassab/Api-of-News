const mongodb = require('mongodb')



const mongoClient = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'


const dbName = 'task-News'


mongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Error has occurred')
    }
    console.log('Success')
    const db = client.db(dbName)



    const ObjectID = mongodb.ObjectId


    // Delete 

    db.collection('users').deleteOne({ _id: new ObjectID('611a4effd8d5d65cb6bd730d') })
        .then((result) => {
            console.log(result.deletedCount)
        }).catch((error) => {
            console.log(error)
        })

    db.collection('users').deleteMany({})
        .then((result) => {
            console.log(result.deletedCount)
        }).catch((error) => {
            console.log(error)
        })
})