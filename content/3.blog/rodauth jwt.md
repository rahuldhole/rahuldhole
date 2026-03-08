# roadauth-rails api jwt cors

`cors.rb` for rails api only roadauth authentication.

The most important is to not `expose: ['authorization']` to receive the JWT token.

```bash
gem install rack-cors
```

```ruby
# cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # also update application.rb allowed_hosts
    origins ENV['ALLOWED_HOSTS']&.split(',') || ['localhost']

    resource "*",
      headers: :any,
      expose: ['authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```