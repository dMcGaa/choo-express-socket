var html = require('choo/html')

export function view (state, emit) {
  return html`
    ${state.ideas.map((i) => displayIdea(emit, i) )}
  `
}

function displayIdea(emit, idea) {
   return html`
    <div>${idea.description}</div>
    <div>
      <ul>
        ${idea.procon.map((pc) => viewProConList(pc))}
        <button onclick=${displayAddProCon}>Add</button>
      </ul>
    </div>
    <div>
      ${uniqueVoteCount(idea.votes)}
      <button>Vote</button>
    </div>
  `

  function displayAddProCon() {
    emit('display add procon', true)
  }
}


function viewProConList(pc) {
  return html`
  <li>${viewSingleProCon(pc)}</li>
  `;
}

function viewSingleProCon(pc) {
  return html`
  <div>${pc.description}</div>
  `;
}

function uniqueVoteCount(votesList) {
  return html`
  <div>count: ${votesList.length}</div>
  `
}
