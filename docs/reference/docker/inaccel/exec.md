*![time/embed](Estimated reading time: {X})*

## Description

Execute a command in a running container

## Usage

```text
docker inaccel exec [OPTIONS] COMMAND [ARG...]
```

## Options

| Name, shorthand        | Default | Description                                                         |
| :--------------------- | :-----: | :------------------------------------------------------------------ |
| ` --env, -e `          |         | Set environment variables                                           |
| ` --index `            | ` 1 `   | Index of the container if there are multiple instances of a service |
| ` --service, -s `      |         | Service name                                                        |
| ` --user, -u `         |         | Username or UID (format: <name|uid>[:<group|gid>])                  |
| ` --workdir, -w `      |         | Working directory inside the container                              |

## Parent command

| Command                        | Description                           |
| :----------------------------- | :------------------------------------ |
| [` docker inaccel `](index.md) | Simplifying FPGA management in Docker |
