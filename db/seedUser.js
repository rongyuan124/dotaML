var seedUser = {};

var user1Obj = {
    firstName : 'TetraScience',
    lastName : 'Support',
    username: 'swang@tetrascience.com',
    password: '123',
    phone : '16093257251',
    isAdmin : true
};

var user2Obj = {
    firstName : 'Issac',
    lastName : 'Newton',
    username: 'spinwang525@gmail.com',
    password: '123',
    phone : '18573897474',
    isAdmin : false

};

var user3Obj = {
    firstName : 'Spin',
    lastName : 'Wang',
    username: 'ts@tetrascience.com',
    password: '123',
    phone : '18573897474'
};

seedUser.user1 = user1Obj;
seedUser.user2 = user2Obj;
seedUser.user3 = user3Obj;

module.exports.seedUser = seedUser;

