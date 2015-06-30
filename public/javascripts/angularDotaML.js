angular
    .module('DotaMLAPP',['btford.socket-io'])
    .controller('Dashboard',Dashboard)
    .factory('DataService',['$http',function($http){
        var baseURL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/';
        var config = {
            params: {
                match_id : '27110133',
                key : '7994766109F00F8528BF6668AA0120C1',
                callback : 'JSON_CALLBACK'
            }
        };
        var matches = {};
        //delete config.headers.X-Requested-With;
        return {
            getAllMatches : function(){
                return matches;
            },
            addMatch : function(match){
                matches[match.matchId] = match;
            },
            updateMatchPrediction : function(matchId,prediction){
                matches[matchId].prediction = prediction;
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
            DataService.updateMatchPrediction(data.matchId, data.prediction); //TODO: directly pass data objection into the function
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

