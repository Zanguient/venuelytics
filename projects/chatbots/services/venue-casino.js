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
    if (response.parameters && response.parameters.WaitTime ) {
            sendWaitTime = true;
    }
    
    if (response.parameters && response.parameters.GameName ) {
            gameName = response.parameters.GameName;
    }

    if (venueId == 960 && !!gameName && (gameName.toLowerCase().indexOf('crap') || gameName.toLowerCase().indexOf('roulette') || gameName.toLowerCase().indexOf("slot") >=0)) {
        channel.sendMessage(userId,`Casino M8trix is card game casino. We don't have Roulette type games.`);
        return;
    }

    if (response.parameters && response.parameters.Facilities ) {
            facility = response.parameters.Facilities;
    }

    if (response.parameters && response.parameters.Availability ) {
            availability = true;
    }

    if (sendWaitTime) { // get wait time for a game
        serviceApi.getActiveGames(venueId, gameName, function(games) {
            var title = "Here are some games with least waiting time.\n";
            sendAnswerImpl(user, venueId,games, title, channel, userId, gameName);
        });
    }


    if (facility && facility.toLowerCase().indexOf("game") >=0 ) {
        if (availability) {
            serviceApi.getGamesAvailableNow(venueId, function(games) {
                let title = "Here are some games which will be available shortly.\n";
                sendAnswerImpl(user, venueId, games, title, channel, userId, gameName);
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
  
function sendAnswerImpl(user, venueId, games, title, channel, userId, gameName) {
    const venue = user.state.get("venue");
    
    const gamesUrl = serviceApi.getGamesUrl(venue.uniqueName, venueId);
    if (games.length > 0) {
        let message = "";
        if (games.length > 0) {
            message = title;
        }
        let padding = Array(20).join(' ');
        for (let idx = 0; idx < games.length; idx++) {
            let waitTime = 'No Wait';
            if (games[idx].waitTimeInMinutes > 0) {
                waitTime = games[idx].waitTimeInMinutes + ' minutes';
            }
            message +=  (games[idx].name + padding).substring(0, padding.length) + ', wait time: ' + waitTime + '\n';
        }
        
        message += `You can also get the latest information by visiting - ${gamesUrl}`;
        channel.sendMessage(userId,message);
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