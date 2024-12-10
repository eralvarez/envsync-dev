# envsync-dev

Manage your env vars and sync them directly in your project.

Sharing environment variables is always challenging, especially in complex projects with multiple repositories, such as micro-frontends and microservices. There’s often a struggle to manage and share environment variables across different environments. Additionally, team members may have variations tailored to specific use cases, such as targeting deployed REST APIs or local ones running in Docker.

That's why I started **EnvSync** an open source webapp and npm package, a simple tool with minimal setup to sync env vars across your projects and teams.

## **Warning**

UI and APIs can and will change without previous notice.

## Roadmap

| Emoji | Status      |
| ----- | ----------- |
| ✅    | Done        |
| ⬜    | Pending     |
| 🦖    | in progress |

| Done? | Activity                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------- |
| ✅    | Start npm package with init and sync commands                                                                 |
| ✅    | Initial web dashboard with projects/project environments/env vars CRUD                                        |
| ✅    | Display real user-related data in dashboard                                                                   |
| ⬜    | Finish Auth UI                                                                                                |
| ⬜    | Build public facing landing page                                                                              |
| ⬜    | Implement Supabase RLS rules                                                                                  |
| ⬜    | Drop Nextjs actions and make Supabase requests directly in frontend                                           |
| ⬜    | Implement teams/organizations                                                                                 |
| ⬜    | Make certain environments to be protected behind login. `envsync cli` will now require login                  |
| ⬜    | Pull env vars from AWS secrets manager (most likely only for paid users)                                      |
| ⬜    | Pull env vars from Google cloud secrets manager (most likely only for paid users)                             |
| ⬜    | Research: Maybe drop nextjs and just use React SPA?, probably using Vite 👀                                   |
| ⬜    | Research: CLI now uses supabase edge functions instead of NextJS API routes                                   |
| ⬜    | Research: If it's a React SPA, host it in CF (it's free! :smile:)                                             |
| ⬜    | Research: Right now envsync uses symmetric-key encryption, we might want to support asymmetric-key encryption |
| ⬜    | Get a nice logo                                                                                               |
| ⬜    | Buy official domain                                                                                           |
| ⬜    | Create X/Twitter account to publish updates                                                                   |

## Host it yourself

This project mainly uses NextJS and Supabase, it is targeted to be deployed in Vercel.

Requirements:

- Supabase account
- Vercel account

## How to use it

### Step #1

Create an account in [envsync-dev](https://envsync-dev.vercel.app/)

### Step #2

Create new project. By doing this it will create a `PROD` env by default

### Step #3

Create env vars in your environment and copy your env-id using the fingerprint button

### Step #4

Go to your project and run:

```shell
npx @ealvarez/envsync init
```

That script will create config file `.envsync`, open it and update `ENVSYNC_PROJECT_ID` with the env-id you previously copied

### Step #5

now run `npx @ealvarez/envsync pull` to pull the contents of your env into our `.env` file
