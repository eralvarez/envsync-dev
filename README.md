# envsync-dev

Manage your env vars and sync them directly in your project

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
