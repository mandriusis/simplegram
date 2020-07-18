Rails.application.routes.draw do
  devise_for :users
  resources :users, only: [:show], param: :username, path: ''
  root to: "welcome#index"
end
