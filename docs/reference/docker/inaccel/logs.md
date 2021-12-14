*![time/embed](Estimated reading time: {X})*

## Description

View output from containers

## Usage

```text
docker inaccel logs [OPTIONS] [PATTERN]
```

## Options

| Name, shorthand        | Default | Description                                                         |
| :--------------------- | :-----: | :------------------------------------------------------------------ |
| ` --follow, -f `       |         | Follow log output                                                   |
| ` --index `            | ` 1 `   | Index of the container if there are multiple instances of a service |
| ` --no-color `         |         | Produce monochrome output                                           |
| ` --service, -s `      |         | Service name                                                        |
| ` --tail, -n `         | ` 10 `  | Number of lines to show from the end of the logs                    |
| ` --timestamps, -t `   |         | Show timestamps                                                     |

## Parent command

| Command                        | Description                           |
| :----------------------------- | :------------------------------------ |
| [` docker inaccel `](index.md) | Simplifying FPGA management in Docker |
