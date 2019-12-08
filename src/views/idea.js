var html = require('choo/html')

export function view (state, emit) {
  return html`
    ${state.ideas.map((i) => displayIdea(emit, i) )}
  `
}

function displayIdea(emit, idea) {
   return html`
    <li>
    <div>${idea.description}</div>
    <div>
      <ul>
        ${viewProConList(idea)}
        <button onclick=${displayAddProCon}>Add</button>
      </ul>
    </div>
    <div>
      ${uniqueVoteCount(idea.votes)}
      <button>Vote</button>
    </div>
    </li>
  `

  function displayAddProCon() {
    emit('display add procon', true)
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
