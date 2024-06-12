# encoding: utf-8
class BannerUploader < BaseUploader
  include CarrierWave::MiniMagick

  version :preview do
    process :resize_to_fill => [200, 140]
  end
  
  version :thumb do
    process :resize_to_fill => [175, 135]
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
