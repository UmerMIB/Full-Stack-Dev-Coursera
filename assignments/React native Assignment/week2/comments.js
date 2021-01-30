import * as ActionTypes from "./ActionTypes"

export const comments = (
  state = {
    errMess: null,
    comments: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {
        ...state,
        errMess: null,
        comments: action.payload,
      }
    case ActionTypes.COMMENTS_FAILED:
      return {
        ...state,
        errMess: action.payload,
        comments: [],
      }
    case ActionTypes.ADD_COMMENT:
      let ids = []
      //Generando un id para concatenar al servidor
      state.comments.forEach((id) => ids.concat(id))

      let id = Math.max(ids)
      id = (id + 1).toFixed
      var comment = action.payload

      //pushes el elemento al state
      //siempre el estado original es inmutable, entonces siempre se mantiene
      //se genera otro a partir del anterior (como una nueva version sin afectar al anterior-)
      return { ...state, comments: state.comments.concat({ id: id, comment }) }
    default:
      return state
  }
}
