const assert = require('assert');

// exports.insertDocument = (db, document, collection, callback) => {
//     const coll = db.collection(collection);
//     coll.insert(document, (err, result) => {
//         assert.equal(err, null);
//         console.log(` successfully inserted  ${result.result.n} documents into  collection ${collection}`);
//         callback(result);
//     })
// };

// exports.removeDocument = (db, document, collection, callback) => {
//     const coll = db.collection(collection);
//     coll.deleteOne(document, (err, result) => {
//         assert.equal(err, null);
//         console.log(` successfully deleted  ${result.result.n} documents from  collection ${collection}`);
//         callback(result);
//     })
// };

// exports.findDocument = (db, collection, callback) => {
//     const coll = db.collection(collection);
//     coll.find({}).toArray((err, docs) => {
//         assert.equal(err, null);
//         callback(docs);
//     })
// };

// exports.updateDocument = (db, document, update, collection, callback) => {
//     const coll = db.collection(collection);
//     coll.updateOne(document, { $set: update }, null, (err, result) => {
//         assert.equal(err, null);
//         console.log(' successfully updated documents with', update);
//         callback(result);
//     })
// };




exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    return coll.insert(document)
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    return coll.deleteOne(document)
};

exports.findDocument = (db, collection, callback) => {
    const coll = db.collection(collection);
    return coll.find({}).toArray();
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, { $set: update }, null)
};