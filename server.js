//
//
//  Thanks a lot to https://gist.github.com/martinsik/2031681
//
//
//TODO: Neu mischen im Spiel
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cardgame';


// Configuration
const portToListenForWebsockets = 1337;
const hostIpForListening        = '0.0.0.0';
const portToListenForBrowser    = 3003;
const dnsName                   = "HOSTNAME"; // External DNS nhostname for all players


// websocket server, http server, filesytem
const webSocketServer = require('websocket').server;
const webServer = require('http'); // Used 2x: websockets and http
const filesystem = require('fs');


// Keep data
var clients = [ ];
var playerData = [ ];
var tableData = [ ];
    tableData[0] = [];       // [0] = Closed stack in dealer hand
    tableData[1] = [];       // [1] = Open stack on table (played cards)
    tableData[2] = "x";      // [2] = Who played a card?

// Setup card game
const cardDirectory = "/CRD/";
//const stackOfCards = ['UN_ROT-0-00','UN_ROT-1-00','UN_ROT-2-00','UN_ROT-3-00','UN_ROT-4-00','UN_ROT-5-00','UN_ROT-6-00','UN_ROT-7-00','UN_ROT-8-00','UN_ROT-9-00','UN_ROT-A-00','UN_ROT-Z-00','UN_ROT-R-00','UN_ROT-1-01','UN_ROT-2-01','UN_ROT-3-01','UN_ROT-4-01','UN_ROT-5-01','UN_ROT-6-01','UN_ROT-7-01','UN_ROT-8-01','UN_ROT-9-01','UN_ROT-A-01','UN_ROT-Z-01','UN_ROT-R-01','UN_GRN-0-00','UN_GRN-1-00','UN_GRN-2-00','UN_GRN-3-00','UN_GRN-4-00','UN_GRN-5-00','UN_GRN-6-00','UN_GRN-7-00','UN_GRN-8-00','UN_GRN-9-00','UN_GRN-A-00','UN_GRN-Z-00','UN_GRN-R-00','UN_GRN-1-01','UN_GRN-2-01','UN_GRN-3-01','UN_GRN-4-01','UN_GRN-5-01','UN_GRN-6-01','UN_GRN-7-01','UN_GRN-8-01','UN_GRN-9-01','UN_GRN-A-01','UN_GRN-Z-01','UN_GRN-R-01','UN_BLA-0-00','UN_BLA-1-00','UN_BLA-2-00','UN_BLA-3-00','UN_BLA-4-00','UN_BLA-5-00','UN_BLA-6-00','UN_BLA-7-00','UN_BLA-8-00','UN_BLA-9-00','UN_BLA-A-00','UN_BLA-Z-00','UN_BLA-R-00','UN_BLA-1-01','UN_BLA-2-01','UN_BLA-3-01','UN_BLA-4-01','UN_BLA-5-01','UN_BLA-6-01','UN_BLA-7-01','UN_BLA-8-01','UN_BLA-9-01','UN_BLA-A-01','UN_BLA-Z-01','UN_BLA-R-01','UN_GLB-0-00','UN_GLB-1-00','UN_GLB-2-00','UN_GLB-3-00','UN_GLB-4-00','UN_GLB-5-00','UN_GLB-6-00','UN_GLB-7-00','UN_GLB-8-00','UN_GLB-9-00','UN_GLB-A-00','UN_GLB-Z-00','UN_GLB-R-00','UN_GLB-1-01','UN_GLB-2-01','UN_GLB-3-01','UN_GLB-4-01','UN_GLB-5-01','UN_GLB-6-01','UN_GLB-7-01','UN_GLB-8-01','UN_GLB-9-01','UN_GLB-A-01','UN_GLB-Z-01','UN_GLB-R-01','UN_JOK-1-00','UN_JOK-1-01','UN_JOK-1-02','UN_JOK-1-03','UN_JOK-4-00','UN_JOK-4-01','UN_JOK-4-02','UN_JOK-4-03'];
const stackOfCards = ['SK_EIL-X-10','SK_EIL-7-00','SK_EIL-8-00','SK_EIL-9-00','SK_EIL-U-02','SK_EIL-O-03','SK_EIL-K-04','SK_EIL-A-11','SK_ROT-X-10','SK_ROT-7-00','SK_ROT-8-00','SK_ROT-9-00','SK_ROT-U-02','SK_ROT-O-03','SK_ROT-K-04','SK_ROT-A-11','SK_GRN-X-10','SK_GRN-7-00','SK_GRN-8-00','SK_GRN-9-00','SK_GRN-U-02','SK_GRN-O-03','SK_GRN-K-04','SK_GRN-A-11','SK_SCH-X-10','SK_SCH-7-00','SK_SCH-8-00','SK_SCH-9-00','SK_SCH-U-02','SK_SCH-O-03','SK_SCH-K-04','SK_SCH-A-11'];
//const stackOfCards = ['FR_BLTT-A-00','FR_BLTT-2-00','FR_BLTT-3-00','FR_BLTT-4-00','FR_BLTT-5-00','FR_BLTT-6-00','FR_BLTT-7-00','FR_BLTT-8-00','FR_BLTT-9-00','FR_BLTT-X-00','FR_BLTT-B-00','FR_BLTT-D-00','FR_BLTT-K-00','FR_HERZ-A-00','FR_HERZ-2-00','FR_HERZ-3-00','FR_HERZ-4-00','FR_HERZ-5-00','FR_HERZ-6-00','FR_HERZ-7-00','FR_HERZ-8-00','FR_HERZ-9-00','FR_HERZ-X-00','FR_HERZ-B-00','FR_HERZ-D-00','FR_HERZ-K-00','FR_KARO-A-00','FR_KARO-2-00','FR_KARO-3-00','FR_KARO-4-00','FR_KARO-5-00','FR_KARO-6-00','FR_KARO-7-00','FR_KARO-8-00','FR_KARO-9-00','FR_KARO-X-00','FR_KARO-B-00','FR_KARO-D-00','FR_KARO-K-00','FR_KREZ-A-00','FR_KREZ-2-00','FR_KREZ-3-00','FR_KREZ-4-00','FR_KREZ-5-00','FR_KREZ-6-00','FR_KREZ-7-00','FR_KREZ-8-00','FR_KREZ-9-00','FR_KREZ-X-00','FR_KREZ-B-00','FR_KREZ-D-00','FR_KREZ-K-00'];
const howManyToDrawEach = 8;

const tableOrder = ["/Player1", "/Player2", "/Player3", "/Player4"];


// *******************
// My helper functions
// *******************

function broadcastGameUpdate(data, clients) {
    var json = JSON.stringify({ type:'gameupdate', data: data });
    for (var i=0; i < clients.length; i++) {
        clients[i].sendUTF(json);
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function flog(string) {
  console.log((new Date()) + ": " + string);
}


// *****************
// Setup HTTP server
// *****************

const myWebServer = webServer.createServer((req, res) => {
  if (req.url.substring(0,5) == cardDirectory) {
    filesystem.readFile("." + req.url, function (error, pgResp) {
        if (error) {
            console.log("requested: " + error);
            res.writeHead(404);
            res.write('404');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'cache-control': 'max-age=300' });
            res.write(pgResp);
            console.log("card not in cache, load it: " + req.url);
        }
         
        res.end();
    });

  } else if (req.url == '/floa') {
    filesystem.readFile("admin.html", function (error, pgResp) {
            if (error) {
                res.writeHead(404);
                res.write('404');
            } else {
                //resp.writeHead(200, { 'Content-Type': 'text/html' });
                res.statusCode = 200;
                res.write(pgResp.toString().replace("##PLAYERNAME##", req.url).replace("##DNSNAME##", dnsName).replace("##WSPORT##", portToListenForWebsockets));
            }
             
            res.end();
        });
  } else if (req.url == '/index.html' || req.url == '/') {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Invalid call");

  } else {

    filesystem.readFile("player.html", function (error, pgResp) {
        if (error) {
            res.writeHead(404);
            res.write('404');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgResp.toString().replace("##PLAYERNAME##", req.url).replace("##DNSNAME##", dnsName).replace("##WSPORT##", portToListenForWebsockets));
        }
         
        res.end();
    });

  }

});
 
myWebServer.listen(portToListenForBrowser, hostIpForListening, () => {
   flog('Web server running at http://' + hostIpForListening + ':' + portToListenForBrowser);
});


// **********************
// Setup Websocket server
// **********************

var secondServer = webServer.createServer(function(request, response) {});
secondServer.listen(portToListenForWebsockets, function() {
  flog("Websocket Server listening on port " + portToListenForWebsockets);
});

var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket request is just an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
  httpServer: secondServer
});
// This callback function is called every time someone tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 

  flog('Connection accepted from ' + connection.remoteAddress);

  // we need to know client index to remove them on 'close' event
  var userdata = { name: "unknown", cardsOnHand: [], cardsInClosed: [], positionOnTable: -1 }
  var index = clients.push(connection) - 1;
  playerData.push(userdata);


  // player sent message
  connection.on('message', function(message) {

    //flog("+++");
    //console.log(message);
    //flog("+++");

    if (message.type === 'utf8') { // outer

        //flog("---");
        var myjson = JSON.parse(message.utf8Data);
        //console.log(myjson.type);
        //flog("---");


        if (myjson.type == "playername") {
                //flog(myjson.data);
                playerData[index].name = myjson.data;
                if (myjson.data == tableOrder[0]) {playerData[index].positionOnTable = 0}
                if (myjson.data == tableOrder[1]) {playerData[index].positionOnTable = 1}
                if (myjson.data == tableOrder[2]) {playerData[index].positionOnTable = 2}
                if (myjson.data == tableOrder[3]) {playerData[index].positionOnTable = 3}
                broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
        }

        if (myjson.type == "playcard") {
                flog(myjson.data[0].playername + " plays " + myjson.data[0].card);

                // Remove card from user and put it on open table stack
                for (var i=0; i < clients.length; i++) {
                    if (playerData[i].name == myjson.data[0].playername) {
                        tableData[2] = myjson.data[0].playername; // Who played the card
                        for (var j=0; j < playerData[i].cardsOnHand.length; j++) {
                            if (playerData[i].cardsOnHand[j] == myjson.data[0].card) {

                                var returnedArray = playerData[i].cardsOnHand.splice(j,1);
                                console.log(returnedArray[0]);
                                tableData[1].push(returnedArray[0]);
                            }
                        }
                    }
                }
                broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
        }

        if (myjson.type == "backToPlayer") {
            var cardReceiver = myjson.data;
            flog("Top card back to " + cardReceiver);
            for (var i=0; i < clients.length; i++) {
                if (playerData[i].name == cardReceiver) {
                    playerData[i].cardsOnHand.push(tableData[1].pop());
                }
            }
            broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
        }

        if (myjson.type == "drawcard") {
                flog(myjson.data + " draws a card from stack");

                // Add card from closed stack to player
                for (var i=0; i < clients.length; i++) {
                    if (playerData[i].name == myjson.data) {
                        playerData[i].cardsOnHand.push(tableData[0].pop());
                    }
                }
                broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
        }

        if (myjson.type == "takestack") {
                flog(myjson.data + " takes the stack");

                // All cards on table to player closed stack
                tableData[2] = myjson.data; // Who played the card
                for (var i=0; i < clients.length; i++) {
                    if (playerData[i].name == myjson.data) {

                        var cardsToAssignToPlayer = tableData[1].splice(0, tableData[1].length);
                        cardsToAssignToPlayer.forEach(function(card) {
                            playerData[i].cardsInClosed.push(card);
                        });
                    }
                }
                broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
        }

        if (myjson.type == "action") {
            if (myjson.data == "shuffle") {
                flog("Shuffle card stack");
                var tempStack = stackOfCards.slice(); // create a copy of the ordered stackOfCards
                shuffle(tempStack); // shuffle it

                // Loop thru all active players and deal cards
                for (var i=0; i < clients.length; i++) {
                    playerData[i].cardsOnHand.splice(0, playerData[i].cardsOnHand.length); // Remove all cards
                    playerData[i].cardsInClosed.splice(0, playerData[i].cardsInClosed.length); // Remove all cards

                    // Deal cards to players (not Admin)
                    if (playerData[i].name != "/ADMIN") {
                        for (var j=1; j <= howManyToDrawEach; j++) {
                            playerData[i].cardsOnHand.push(tempStack.pop())
                        }
                    }
                }

                // Assign remaining cards to table closed stack == [0]
                tableData[0] = tempStack;
                tableData[1] = []; // Open stack is empty
                tableData[2] = "x"; // Player who played last card

                broadcastGameUpdate({playerData: playerData, tableData: tableData}, clients);
                
            }
        }


    }
  });


    // user disconnected
    connection.on('close', function(connection) {
        flog(clients.length + " <> " + index);
        clients.splice(index, 1);
        playerData.splice(index, 1);
    });

});

