---
title: "roadauth-rails api jwt cors"
description: "roadauth-rails api jwt cors - Dive into the details of roadauth-rails api jwt cors with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=roadauth-rails+api+jwt+cors" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "Security" }
---

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