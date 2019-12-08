var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var socket = require('socket.io-client')
var ideaData = require('./data/ideas.json');
var idea = require('./views/idea')

var app = choo()
app.use(devtools())
app.use(ideaStore)
app.use(countStore)
app.use(loadIdeas)
app.use(socketIo)
app.route('/', mainView)
app.mount('body')

// ${state.ideas.map((i) => carDetails.view(i) )}
function mainView (state, emit) {
  return html`
    <body>
      <ul class="bv-list">
        <li class="bv-list-heading">
          <div class="bv-idea">Idea</div>
          <div class="bv-procon">ProCon</div>
          <div class="bv-vote">Vote</div>
        </li>
        <li>
          ${idea.view(state, emit)}
        </li>
        <li>
          <div>
            <button onclick=${addIdeaShown}>Add Idea</button>
          </div>
        </li>
      </ul>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
      ${ ideaInput(state, emit) }
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
  function addIdeaShown() {
    emit('display add', true)
  }
}

function loadIdeas (state, emitter) {
  state.ideas = ideaData.ideas;
}

function ideaInput(state, emit) {
  if(state.showIideaInputPanel) {
    return html`
      <div>INPUT IDEA</div>
      <button onclick=${addIdeaHidden}>Close</button>
    `
  }
  return html``
  function addIdeaHidden() {
    emit('display add', false)
  }
}

function countStore (state, emitter) {
  state.count = 0;
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

function ideaStore (state, emitter) {
  state.ideas = [];
  state.ideaInputPanel = false;
  emitter.on('display add', (isShown) => {
    state.showIideaInputPanel = isShown
    emitter.emit('render')
  })
  emitter.on('display add procon', (isShown) => {
    state.showProconInput = isShown
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
      // state.socket.emit('chat message', 'one second');
      timer = 0;
    }
  }
}