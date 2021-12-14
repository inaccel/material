*![time/embed](Estimated reading time: {X})*

## Description

Run a one-off command

## Usage

```text
docker inaccel run [OPTIONS] SERVICE [COMMAND] [ARG...]
```

## Options

| Name, shorthand        | Default | Description                                        |
| :--------------------- | :-----: | :------------------------------------------------- |
| ` --entrypoint `       |         | Override the entrypoint of the container           |
| ` --env, -e `          |         | Set environment variables                          |
| ` --no-deps `          |         | Don't start linked services                        |
| ` --publish, p `       |         | Publish a container's port(s) to the host          |
| ` --user, -u `         |         | Username or UID (format: <name|uid>[:<group|gid>]) |
| ` --volume, -v `       |         | Bind mount a volume                                |
| ` --workdir, -w `      |         | Working directory inside the container             |

## Parent command

| Command                        | Description                           |
| :----------------------------- | :------------------------------------ |
| [` docker inaccel `](index.md) | Simplifying FPGA management in Docker |
