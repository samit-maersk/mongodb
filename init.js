conn = new Mongo();
db = conn.getDB("test");
db.events.insertMany([
    {
        "type": "",
        "message": "",
        "date": new Date("2023-07-04")
    }
])

db.events.find({})