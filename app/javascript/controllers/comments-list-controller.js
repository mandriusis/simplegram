import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["postId", "commentList", "blankslateText", "newCommentErrors", "textarea"]

  connect() { }

  onPostError(event) {
    let [data, status, xhr] = event.detail;

    this.newCommentErrorsTarget.innerHTML = xhr.response;
  }

  onPostSuccess(event) {
    let [data, status, xhr] = event.detail;

    if (this.blankslateTextTargets.link > 0) {
      this.blankslateTextTarget.remove();
    }

    this.commentListTarget.innerHTML += xhr.response;
    this.textareaTarget.value = "";
    this.newCommentErrorsTarget.innerHTML = "";
  }
}
