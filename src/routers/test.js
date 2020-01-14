db.messages.find(
    { sender: { $oid: "5e1853fa46adc13cc4b6c181" } }
)

db.messages.aggregate([
    {
        $match:
        {
            $or: [
                {
                    sender: ObjectId("5e1853fa46adc13cc4b6c181"),
                    recipient: ObjectId("5e1d755fd3f2ad22e07a1e9b")
                },
                {
                    recipient: ObjectId("5e1853fa46adc13cc4b6c181"),
                    sender: ObjectId("5e1d755fd3f2ad22e07a1e9b")
                }
            ]
        }
    }
])