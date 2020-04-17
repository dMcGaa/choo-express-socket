#
A ChooJS project using Socket.IO and Express.

## [Demo](https://choo-socket.herokuapp.com/) - modern browsers please! heroku free dyno takes a bit of time to spin up.

## Dev
- https://github.com/remy/nodemon - nodemon for reloading main node script
- https://socket.io/get-started/chat/ - socketIO

## Heroku
- <https://devcenter.heroku.com/articles/node-websockets> - need to set `http-session-affinity` in Heroku with Socket.io
- Need to have PORT for Express set by Heroku `process.env.PORT`

## Useful / Used
- <https://stackoverflow.com/questions/8663246/javascript-timer-loop> - timer loop
- <https://stackoverflow.com/questions/8431651/getting-a-diff-of-two-json-objects> - diff json
- <https://github.com/ramda/ramda/wiki/What-Function-Should-I-Use> - what ramda
- <https://stackoverflow.com/questions/37979489/how-to-watch-and-reload-ts-node-when-typescript-files-change> - nodemon watch
- <https://stackoverflow.com/questions/55784589/typescript-with-socket-io-build-issue-resolving-unused-require-statements> - uws dependency
- <https://expressjs.com/en/starter/static-files.html> - express serve static files
- <https://stackoverflow.com/questions/11795481/node-js-socket-io-require> - socket require
- <https://alligator.io/angular/socket-io/> - Maybe this, join by id
- <https://github.com/socketio/socket.io-client> - socket client
- <https://github.com/facundofarias/awesome-websockets> - awesome list websockets

### Styling and Design 
- <https://codepen.io/neoberg/pen/kavnF> loading spinner
- <https://www.seebeetee.com/css-loading-animations-from-codepen/> - loading animations css

## Other Cool Apps using WebSockets
- <https://www.creativebloq.com/app-design/top-10-realtime-web-apps-5133752> - top 10 realtime web apps
- <https://www.websocket.org/demos/todomvc/> - websocket todo
