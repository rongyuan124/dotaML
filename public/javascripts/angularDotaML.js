angular
    .module('DotaMLAPP',[])
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
        //delete config.headers.X-Requested-With;
        return {
            getMatchInfo : function(matchId){
                return $http.get('/match/' + matchId).then(
                    function(resp) {return resp;},
                    function(err) {return console.error(err);}
                );
            }
        }
    }]);

Dashboard.$inject = ['DataService'];
function Dashboard (DataService){

    var self = this;
    self.matchId = 27110133;
    self.matchInfo = {};

    self.getMatchInfo = function(matchId){
        DataService.getMatchInfo(matchId).then(function(resp){
            self.heroIdList = resp.data;
        });
    };
}

