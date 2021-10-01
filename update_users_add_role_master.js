db.getCollection('users').find({ username: { $in: ['alessandro.silva', 'rodrigo.silva'] }})
.forEach(doc => {
    doc.roles.push('MST')
    
    db.getCollection('users').update(
        { _id: doc._id },
        { 
            $set: {
                roles: doc.roles
            }
        }
    )
})