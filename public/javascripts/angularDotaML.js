angular
    .module('DotaMLAPP',['btford.socket-io'])
    .controller('Dashboard',Dashboard)
    .factory('DataService',['$http',function($http){

        var matches = {};
        $http.get('/matches').then(
            function(resp) {
                resp.data.forEach(function(match){
                    matches[match._id] = match;
                });

                console.log('here',matches);
            },
            function(err) {console.error(err)}
        );
        return {
            getAllMatches : function(){
                return matches;
            },
            addMatch : function(match){
                matches[match.matchId] = match;
            },

            updateMatch : function(match){
                matches[match._id] = match;
            },
            updateMatchPrediction : function(match_id,prediction){
                matches[match_id].prediction = prediction;
            },
            getMatchInfo : function(matchId){
                return $http.get('/match/' + matchId).then(
                    function(resp) {return resp;},
                    function(err) {return console.error(err);}
                );
            }
        }
    }])
    .factory('SocketService',['socketFactory','DataService',function(socketFactory, DataService){
        var dashboardSocket = socketFactory();
        dashboardSocket.on('match',function(data){
            console.log(data);
            DataService.updateMatch(data); //TODO: directly pass data objection into the function
        });
        dashboardSocket.on('matchPrediction',function(data){
            console.log(data);
            DataService.updateMatchPrediction(data._id, data.prediction);
        })
        return dashboardSocket;
    }]);


// controller
Dashboard.$inject = ['DataService','SocketService'];
function Dashboard (DataService, SocketService){

    var self = this;
    self.matchId = 27110133;
    self.matches = DataService.getAllMatches();


    self.addMatchInfo = function(matchId){
        DataService.getMatchInfo(matchId).then(function(resp){
            var match = resp.data;
            DataService.addMatch(match);
        });
    };
}

