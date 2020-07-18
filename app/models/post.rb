class Post < ApplicationRecord
  belongs_to :user

  validates :image, attached: true

  has_one_attached :image
end
