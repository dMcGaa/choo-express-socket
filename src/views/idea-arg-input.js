import {
  isShownAddProCon,
  ideaProConFormInputDescription,
  ideaProConFormSetIndex,
  ideaProConAddition,
} from '../choo-actions';

var html = require('choo/html')

export function view (state, emit) {
  if(state.showProConInputPanel) {
    return html`
      <div>PROCON</div>
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
    emit(ideaProConAddition, {"idx": state.proconFormInput.idx, "procon": {description: state.proconFormInput.description, votes:[]}})
  }
  function updateDescription(e) {
    emit(ideaProConFormInputDescription, e.target.value)
  }
}

