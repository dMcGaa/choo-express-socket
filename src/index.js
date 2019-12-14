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
      <header>Brainstorm Vote</header>
      <div class="idea-pane">
        <div class="topic">
          <div>TOPIC</div>
          <div>Description</div>
        </div>

        <ul class="bv-list">
          <li class="bv-list-heading">
            <div class="bv-idea">Idea</div>
            <div class="bv-procon">Pros and Cons</div>
            <div class="bv-vote">Vote</div>
          </li>
          ${idea.view(state, emit)}
          <li>
            <div>
              <button class="action" onclick=${addIdeaShown}>Add Idea</button>
            </div>
          </li>
        </ul>
      </div>
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
      <button class="add-idea" onclick=${addIdea}>Add Idea</button>
      <button onclick=${addIdeaHidden}>Close</button>
    `
  }
  return html``
  function addIdeaHidden() {
    emit('display add', false)
  }
  function addIdea() {
    emit('client voting update', {"description": "test desc", "name": "test name", "procon": [], "votes": []})
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
  emitter.on('client voting update', (idea) => {
    state.ideas = [ ...state.ideas, idea ]
    emitter.emit('render')
    state.socket.emit('voting update', state.ideas);
  })
  emitter.on('voting update', (ideas) => {
    state.ideas = [ ...ideas ]
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
  var timeout = 1000;
  state.socket.on('chat message', function(msg){
    emitter.emit('set count', msg)
  });
  state.socket.on('voting update', function(ideas){
    console.log("received ideas", ideas)
    emitter.emit('voting update', ideas)
  });
}
