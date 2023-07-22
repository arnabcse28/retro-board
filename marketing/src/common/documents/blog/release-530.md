---
slug: 'release-5.3.0'
lang: 'en'
title: 'Retrospected 5.3.0'
subtitle: "What's new in Retrospected 5.3.0?"
author: 'Antoine Jaussoin'
date: '2023-07-22'
keywords: 'blog,release,5.3.0,ai-coach,chat gpt 4,self-hosting,self hosted'
cover: '/assets/blog/release-530/video.png'
---

Retrospected 5.3.0 out! Discover what's new in this release. We packed a lot of new options for customising your retrospectives even more.

# New Options

![New Options](/assets/blog/release-530/options.png,1744x932)

## Restrict title editing to moderators

With this option turned on, only the moderator can change the title of a retrospective. This is useful if you want to make sure the title is not changed during the retrospective.

## Restrict ordering and grouping to moderators

With this option turned on, only the moderator can change the order and grouping of the cards.

# New general features

## Private sessions

When accessing a private session that you don't have access to, it will now show the name of the moderator.

This is useful for the users to know who to contact to get access to the session.

## Chat GPT 4

The Agile Coach is now using Chat GPT 4, which is the latest version of the model. This should improve the quality of the answers.

# New Self-Hosted Features

## Prevent account deletion

Currently, any user can delete their data. This is important in the public-facing app (app.retrospected.com), but could be a problem for self-hosted instances.

You can now prevent account deletion by setting the `DISABLE_DATA_DELETION` environment variable to `true` on the backend.

See the full `docker-compose.yml` [example](https://docs.retrospected.com/docs/self-hosting/optionals) for more information.

## Prevent anyone from seeing the posts authors

Currently, a moderator can turn on an option to see who posted what ("Show Author"). You can now disable this option across the board, so even the moderators won't be able to see the authors of posts.

This can be important for self-hosted instances where the anonymity of content is paramount.

This can be set using the `DISABLE_REVEAL_NAMES` environment variable on the backend.

See the full `docker-compose.yml` [example](https://docs.retrospected.com/docs/self-hosting/optionals) for more information.

# Miscellaneous

## Demo video

On the marketing website, you will now have access to a quick 2-minute video showing how to use Retrospected.

This video is also shown on the app when a user doesn't have any retrospective yet.

![Demo video](/assets/blog/release-530/video.png,3452x1874)
