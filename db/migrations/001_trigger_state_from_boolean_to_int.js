/**
 * Created by pengwei on 5/18/15.
 */
db.triggers.find().forEach( function(obj) { obj.state=0; obj.startWaitTime=0; obj.waitDuration=600000; db.triggers.save(obj); } );