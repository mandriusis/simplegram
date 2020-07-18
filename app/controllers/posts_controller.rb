class PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    #with_attached_image avoid n+1
    @posts = Post.with_attached_image.order(created_at: :desc)
  end

  def new
    @post = current_user.posts.new
  end

  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      redirect_to posts_path, notice: "Created Post"
    else
      render :new, notice: "Please try again"
    end
  end

  def destroy
    # TODO You can delete anyone's post!!
    # @post = current_user.posts.find(params[:id])
    @post = Post.find(params[:id])
    @post.destroy
    redirect_to user_path(@post.user.username), notice: "Post deleted"
  end

  private 

  def post_params
    params.require(:post).permit(:image)
  end
end