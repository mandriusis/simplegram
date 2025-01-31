class PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    @posts = Post.of_followed_users(current_user.following).with_attached_image.order(created_at: :desc)
  end

  def explore
    @posts = Post.with_attached_image.order(created_at: :desc)
  end

  def new
    @post = current_user.posts.new
  end

  def create
    @post = current_user.posts.build(post_params)
    @post.comments&.first&.user = current_user

    if @post.save
      redirect_to posts_path, notice: "Created Post"
    else
      render :new, notice: "Please try again"
    end
  end

  def destroy
    @post = current_user.posts.find(params[:id])
    @post.destroy
    redirect_to user_path(@post.user.username), notice: "Post deleted"
  end

  private 

  def post_params
    params.require(:post).permit(:image, comments_attributes: [:body])
  end
end