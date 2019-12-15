import { 
  isShownAddIdea, isShownAddProCon,
  countIncrement, countSet,
  ideaVoteIncrement,
  ideaProConAddition,
  ideaProConFormInputDescription,
  ideaProConFormSetIndex,
  ideaFormInputDescription,
} from './choo-actions';

import {
  socketIdeaUpdate
} from './socket-actions';

var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var socket = require('socket.io-client')
var ideaData = require('./data/ideas-empty.json');
var idea = require('./views/idea')
var proconForm = require('./views/idea-arg-input')

setTimeout(initialize, 750);

function initialize() {
  var app = choo()
  app.use(devtools())
  app.use(ideaStore)
  app.use(countStore)
  app.use(loadIdeas)
  app.use(socketIo)
  app.route('/', mainView)
  mountChoo(app)
}

function mountChoo(app) {
  app.mount('body')
}

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
      ${ ideaInput(state, emit) }
      ${ proconForm.view(state, emit)}
    </body>
  `

  function onclick () {
    emit(countIncrement, 1)
  }
  function addIdeaShown() {
    emit(isShownAddIdea, true)
  }
}

function loadIdeas (state, emitter) {
  state.ideas = ideaData.ideas;
}

function ideaInput(state, emit) {
  if(state.showIdeaInputPanel) {
    return html`
      <div>INPUT IDEA</div>
      <input type=text
        oninput=${updateDescription}
        value=${state.ideaInputForm.description} />
      <button class="add-idea" onclick=${addIdea}>Add Idea</button>
      <button onclick=${addIdeaHidden}>Close</button>
    `
  }
  return html``
  function addIdeaHidden() {
    emit(isShownAddIdea, false)
  }
  function addIdea() {
    emit('client voting update', {"description": state.ideaInputForm.description, "name": "test name", "procon": [], "votes": []})
  }
  function updateDescription(e) {
    emit(ideaFormInputDescription, e.target.value)
  }
}

function countStore (state, emitter) {
  state.count = 0;
  emitter.on(countIncrement, function (count) {
    state.count += count
    emitter.emit('render')
    state.socket.emit('chat message', state.count);
  })
  emitter.on(countSet, (count) => {
    state.count = count
    emitter.emit('render')
  })
  emitter.on('client voting update', (idea) => {
    state.ideas = [ ...state.ideas, idea ]
    emitter.emit('render')
    state.socket.emit(socketIdeaUpdate, state.ideas);
  })
  emitter.on('voting update', (ideas) => {
    state.ideas = [ ...ideas ]
    emitter.emit('render')
  })
}

function ideaStore (state, emitter) {
  state.ideas = [];
  state.showIdeaInputPanel = false;
  state.showProConInputPanel = false;
  state.proconFormInput = {
    description: "",
    idx: null
  };
  state.ideaInputForm = {
    description: ""
  };

  emitter.on(isShownAddIdea, (isShown) => {
    state.showIdeaInputPanel = isShown
    emitter.emit('render')
  })

  emitter.on(isShownAddProCon, (isShown) => {
    state.showProConInputPanel = isShown
    emitter.emit('render')
  })

  // TODO fix this, don't want to directly manipulate array values, add only?
  emitter.on(ideaVoteIncrement, (ideaIdx) => {
    const ideas = [...state.ideas];
    const updatedIdea = {...state.ideas[ideaIdx]};
    updatedIdea.votes.push({"name": "test"})
    ideas[ideaIdx] = updatedIdea;
    state.ideas = [...ideas]
    emitter.emit('render')
    state.socket.emit(socketIdeaUpdate, state.ideas);
  })

  // TODO fix this, don't want to directly manipulate array values, add only?
  emitter.on(ideaProConAddition, (payload) => {
    console.log("payload", payload)
    const ideaIdx = payload.idx;
    const procon = payload.procon;
    const ideas = [...state.ideas];
    const updatedIdea = {...state.ideas[ideaIdx]};
    updatedIdea.procon.push(procon)
    ideas[ideaIdx] = updatedIdea;
    state.ideas = [...ideas]
    emitter.emit('render')
    state.socket.emit(socketIdeaUpdate, state.ideas);
  })

  //TODO dont directly modify state
  emitter.on(ideaProConFormInputDescription, (payload) => {
    state.proconFormInput = {
      ...state.proconFormInput,
      description: payload
    }
    emitter.emit('render')
  })

  emitter.on(ideaProConFormSetIndex, (idx) => {
    state.proconFormInput = {
      ...state.proconFormInput,
      idx: idx
    }
  })

  //TODO dont directly modify state
  emitter.on(ideaFormInputDescription, (payload) => {
    state.ideaInputForm = {
      description: payload
    }
    emitter.emit('render')
  })
}

function socketIo (state, emitter) {
  state.socket = socket();
  var timeout = 1000;
  state.socket.on('chat message', function(msg){
    emitter.emit(countSet, msg)
  });
  state.socket.on(socketIdeaUpdate, function(ideas){
    console.log("received ideas", ideas)
    emitter.emit('voting update', ideas)
  });
}
