#Kartentisch

As of Corona lockdown I had to find a way to play cards easy online with friends. This is a very quick and dirty solution but we played already several hours with it.

### Prerequisites
install node.js

###### Installation
1. Put all files in a directory
2. Create a directory **CRD**
3. Put image files of the playing cards into that directory, based on the array in *server.js* (line 36-38)
4. adjust hostname in line 17 of *server.js* (all players need to have the same DNS name)
5. run `node server.js` and connect with your favorite browser to port http://HOSTNAME:3003/Player1 and ..2 ..3 ...4
6. One browser window has to open http://HOSTNAME:3003/floa which is the ADMIN who ca deal cards to the players.
