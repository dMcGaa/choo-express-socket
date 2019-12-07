var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var socket = require('socket.io-client')

var app = choo()
app.use(devtools())
app.use(countStore)
app.use(socketIo)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
    state.socket.emit('chat message', state.count);
  })
  emitter.on('set count', (count) => {
    state.count = count
    emitter.emit('render')
  })
}

function socketIo (state, emitter) {
  state.socket = socket();
  var timer = 0;
  var increment = 10;
  var timeout = 1000;
  state.socket.on('chat message', function(msg){
    emitter.emit('set count', msg)
  });
  setInterval(myMethod, increment);
  function myMethod( )
  {
    timer += increment
    if(timer > timeout) {
      socket.emit('chat message', 'one second');
      timer = 0;
    }
  }
}