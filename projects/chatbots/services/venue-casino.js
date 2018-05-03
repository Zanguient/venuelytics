"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venueId = user.state.get("selectedVenueId");
    let sendWaitTime = false;
    let gameName = null;
    let facility = null; //games game tournament
    let availability = false;
    let criteria = null;
    let props = null;
    let minBet = false;
    if (response.parameters && response.parameters.WaitTime ) {
            sendWaitTime = true;
    }
    
    if (response.parameters && response.parameters.GameName ) {
            gameName = response.parameters.GameName;
    }

    if (venueId === 960 && !!gameName && (gameName.toLowerCase().indexOf('crap') >= 0 || gameName.toLowerCase().indexOf('roulette') >=0  || gameName.toLowerCase().indexOf("slot") >=0)) {
        channel.sendMessage(userId,`Casino M8trix is card game casino. We don't have Roulette, Crap or Slot type games.`);
        return;
    }

    if (response.parameters && response.parameters.Facilities ) {
            facility = response.parameters.Facilities;
    }

    if (response.parameters && response.parameters.Availability ) {
            availability = true;
    }

    if (response.parameters && response.parameters.criteria ) {
        criteria = response.parameters.criteria;
    }

    if (response.parameters && response.parameters.props ) {
        props = response.parameters.props;
    }
    if (criteria && props) { // current only min is supported
        if (props.toLowerCase().indexOf("age") >=0) {
            channel.sendMessage(userId,`Minimum age to play - 21 & over. The guests under 21 can eat at the restaurants.`);
            return;
        } 

        if (props.toLowerCase().indexOf("bid") >=0 || props.toLowerCase().indexOf("bet") >=0){
            minBet = true;
        }

    }
    if (sendWaitTime || minBet) { // get wait time for a game
        serviceApi.getActiveGames(venueId, gameName, function(games) {
            
            if (sendWaitTime) {
                let t0 = games.length === 1 ? "\n":"Here are some games with least waiting time.\n";
                sendWaitTimeImpl(user, venueId,games, t0, channel, userId, gameName);
            } else {
                let t1 = games.length === 1 ? "\n":"Here are some games with their minimum bets.\n";
                sendBetInfoImpl(user, venueId,games, t1, channel, userId, gameName); 
            }
        });
    }


    if (facility && facility.toLowerCase().indexOf("game") >=0 ) {
        if (availability) {
            serviceApi.getGamesAvailableNow(venueId, function(games) {
                let title = "Here are some games which will be available shortly.\n";
                sendWaitTimeImpl(user, venueId, games, title, channel, userId, gameName);
            });
        } else {
            const venue = user.state.get("venue");
            const gamesUrl = serviceApi.getGamesUrl(venue.uniqueName, venueId);
            channel.sendMessage(userId,`Sorry we didn't have the game you are looking for! You can find the game and their wait time here ${gamesUrl}`);
            return;
        }
    }

    if (facility && facility.toLowerCase().indexOf("tournament") >=0 ) { // send send schedules or
        serviceApi.getActiveTournaments(venueId, function(tournaments){
            if (tournaments.length === 0) {
               channel.sendMessage(userId,"Currently, there are no active tournaments. Please check later.");
            } else {
                let message = "We have the following active tournaments currently running.\n";
                for (var idx = 0; idx < tournaments.length; idx++) {
                    message += `${idx+1}: ` + tournaments[idx].title +"\n";
                }
                const venue = user.state.get("venue");
                let tournamentUrl = serviceApi.getTournamentsUrl(venue.uniqueName, venueId);
                message += `You can also get the latest information by visiting - ${tournamentUrl}`;
                channel.sendMessage(userId, message);
            }
        });
    }
 };

function sendBetInfoImpl(user, venueId, games, title, channel, userId, gameName) {
    const venue = user.state.get("venue");
    
    const gamesUrl = serviceApi.getGamesUrl(venue.uniqueName, venueId);
    if (games.length > 0) {
        let message = "";
        if (games.length > 0) {
            message = title;
        }
        let padding = Array(20).join(' ');
        for (let idx = 0; idx < games.length; idx++) {
            let minBet = 'N/A';
            if (games[idx].minimumBid > 0) {
                minBet = "$" + games[idx].minimumBid ;
            }
            message +=  (games[idx].name + padding).substring(0, padding.length) + ', minimum Bet: ' + minBet + '\n';
        }
        
        message += `You can also get this information by visiting - ${gamesUrl}`;
        channel.sendMessage(userId,message);
        return;
    } else if (games.length === 0) {
        channel.sendMessage(userId,`Sorry I don't have the information you are looking for. You may get this information by visiting - ${gamesUrl}.`);
        return;
    }
}
function sendWaitTimeImpl(user, venueId, games, title, channel, userId, gameName) {
    const venue = user.state.get("venue");
    
    const gamesUrl = serviceApi.getGamesUrl(venue.uniqueName, venueId);
    if (games.length > 0) {
        let message = title;
        
       
        let genericList = [];

        for (let idx = 0; idx < games.length; idx++) {
             let waitTime = 'No Wait';
             if (games[idx].waitTimeInMinutes > 0) {
                 waitTime = games[idx].waitTimeInMinutes + ' minutes';
             }
            let obj = {};
            obj.text = games[idx].name;
            obj.subText = ' wait time: ' + waitTime;
            genericList.push(obj);
        }

        channel.sendGenericViewList(userId, genericList, gamesUrl);
        return;
    } else if (games.length === 0) {
        if (!!gameName) {
            channel.sendMessage(userId,`No "${gameName}" game currently available. You can get the latest information by visiting - ${gamesUrl}.`);
        } else {
            channel.sendMessage(userId,`I didn't find any active games. You can get the latest information by visiting - ${gamesUrl}.`);
        }
        return;
    }
}
  

module.exports = {
  sendAnswer: sendAnswer
};