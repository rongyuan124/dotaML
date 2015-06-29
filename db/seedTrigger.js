var seedTrigger = {};

var triggerObj1 = {
    device : '',
    user : '',
    global : true,
    threshold : 30,
    action : {email:true,text:true},
    comparator : 'gt'
};

var triggerObj2 = {
    global : false,
    device : '',
    user : '',
    threshold : 200,
    action : {email:true,text:true},
    comparator : 'gt'
};

seedTrigger.trigger1 = triggerObj1;
seedTrigger.trigger2 = triggerObj2;

module.exports.seedTrigger = seedTrigger;