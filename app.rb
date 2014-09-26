require 'sinatra'
require_relative 'lib/breeze.rb'

# class Breeze::App < Sinatra::Application
  # configure :development do |c|
  #   c.set :bind, '10.10.10.10'
  # end

  set :bind, '10.10.10.10'

  get '/' do
    send_file 'index.html'
    erb :calculate
  end

  post '/estimate' do
    @estimate = Breeze::Calculate.new(params["input-text"]).calculate
    erb :result
  end

  get '/' do
    redirect '/temps'
  end
# end
