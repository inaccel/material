*![time/embed](Estimated reading time: {X})*

## Description

Create and start containers

## Usage

```text
docker inaccel up [OPTIONS] [SERVICE]
```

## Options

| Name, shorthand            | Default | Description                                                               |
| :------------------------- | :-----: | :------------------------------------------------------------------------ |
| ` --always-recreate-deps ` |         | Recreate dependent containers                                             |
| ` --force-recreate `       |         | Recreate containers even if their configuration and image haven't changed |
| ` --no-deps `              |         | Don't start linked services                                               |
| ` --no-recreate `          |         | If containers already exist, don't recreate them                          |

## Parent command

| Command                        | Description                           |
| :----------------------------- | :------------------------------------ |
| [` docker inaccel `](index.md) | Simplifying FPGA management in Docker |
