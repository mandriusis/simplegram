import { Controller } from "stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets = ["postId", "commentList", "blankslateText", "newCommentErrors", "textarea"]

  connect() {
    this.setupSubscription();
  }

  setupSubscription() {
    consumer.subscriptions.create(
      { channel: "PostCommentChannel", post_id: this.postIdTarget.dataset.postId },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          //console.log("connected")
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          //console.log("disconnected")
        },
        received: data => {
          switch (data.action) {
            case "created":
              this.handleNewComment(data);
              break;
            case "destroy":
              this.handleDeletedComment(data);
              break;
            default:
              console.log("No idea how to handle this action");
          }
        }
      });

  }

  handleNewComment(data) {
    this.commentListTarget.innerHTML += data.html;
    this.updateBlankslateText();
  }

  handleDeletedComment(data) {
    const commentElement = document.querySelector(`[data-comment-id="comment_${data.comment_id}"]`);

    if (commentElement) {
      commentElement.remove();
      this.updateBlankslateText();
    }

  }

  onPostError(event) {
    let [data, status, xhr] = event.detail;

    this.newCommentErrorsTarget.innerHTML = xhr.response;
  }

  onPostSuccess(event) {
    let [data, status, xhr] = event.detail;

    this.scrollToBottom();
    this.textareaTarget.value = "";
    this.newCommentErrorsTarget.innerHTML = "";
  }

  updateBlankslateText() {
    if (this.blankslateTextTargets.length > 0 && this.commentListTargets.length > 0) {
      this.blankslateTextTarget.remove();
    }
    else if (this.blankslateTextTargets.length == 0 && !document.querySelector('[data-comment-id^="comment_')) {
      var placeholder = document.createElement('h6');
      placeholder.setAttribute('data-target', 'comments-list.blankslateText');
      placeholder.innerText = "No comments yet, be the first one.";

      this.commentListTarget.insertAdjacentElement('afterbegin', placeholder);
    }
  }

  scrollToBottom() {
    const lastComment = this.commentListTarget.children.item(this.commentListTarget.children.length - 1);

    lastComment.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  }
}
