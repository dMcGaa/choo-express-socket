import {
  isShownAddProCon,
  ideaVoteIncrement,
  ideaProConAddition,
  ideaProConFormInputDescription,
} from '../choo-actions';

var html = require('choo/html')

export function view (state, emit) {
  return html`
    ${state.ideas.map((i, idx) => displayIdea(state, emit, i, idx) )}
  `
}

function displayIdea(state, emit, idea, idx) {
   return html`
    <li class="idea">
    <div class="idea-descr">${idea.description}</div>
    <div class="idea-procon">
      <ul>
        ${viewProConList(idea)}
        <button class="add-arg" onclick=${displayAddProCon}>Add Arg</button>
      </ul>
    </div>
    <div class="idea-votes">
      ${uniqueVoteCount(idea.votes)}
      <button onclick=${updateVoteCount}>Vote</button>
    </div>
    </li>
    ${ proConInput(state, emit, idx) }
  `

  function displayAddProCon() {
    emit(isShownAddProCon, true)
  }
  function updateVoteCount() {
    emit(ideaVoteIncrement, idx); //idea.id
  }
}


function viewProConList(idea) {
  if(idea.procon) {
    return html`
      ${idea.procon.map((pc) => viewSingleProCon(pc))}
    `;
  }
}

function viewSingleProCon(pc) {
  return html`
  <li>
  <div>${pc.description}</div>
  </li>
  `;
}

function uniqueVoteCount(votesList) {
  if(votesList) {
    return html`
      <div>count: ${votesList.length}</div>
    `
  }
  return html`<div>count: 0</div>`;
}

function proConInput(state, emit, idx) {
  if(state.showProConInputPanel) {
    return html`
      <div>INPUT PROCON</div>
      <input type=text
        oninput=${updateDescription}
        value=${state.proconFormInput.description} />
      <button class="add-idea" onclick=${addProCon}>Add Idea</button>
      <button onclick=${addProConHidden}>Close</button>
    `
  }
  return html ``
  function addProConHidden() {
    emit(isShownAddProCon, false)
  }
  function addProCon() {
    emit(ideaProConAddition, {"idx": idx, "procon": {description: state.proconFormInput.description, votes:[]}})
  }
  function updateDescription(e) {
    emit(ideaProConFormInputDescription, e.target.value)
  }
}

