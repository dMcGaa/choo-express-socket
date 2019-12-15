import {
  isShownAddProCon,
  ideaVoteIncrement,
  ideaProConFormSetIndex,
} from '../choo-actions';

var html = require('choo/html')

export function view (state, emit) {
  return html`
    ${displayIdeaEntryText(state)}
    ${state.ideas.map((i, idx) => displayIdea(state, emit, i, idx) )}
  `
}

function displayIdeaEntryText(state) {
  if(state.ideas.length > 0 ) return html``;
  return html`<div class="prompt-idea">Enter an Idea on the topic.</div>`
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
  `

  function displayAddProCon() {
    emit(isShownAddProCon, true)
    emit(ideaProConFormSetIndex, idx)
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
