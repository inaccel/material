*![time/embed](Estimated reading time: {X})*

## Description

Simplifying FPGA management in Docker

## Usage

```text
docker inaccel [OPTIONS] COMMAND
```

## Options

| Name, shorthand        | Default                 | Description                                           |
| :--------------------- | :---------------------: | :---------------------------------------------------- |
| ` --env, -e `          |                         | Set environment variables                             |
| ` --env-file `         |                         | Specify an alternate environment file                 |
| ` --profile `          |                         | Specify a profile to enable                           |
| ` --project-name, -p ` | `inaccel/fpga-operator` | Specify an alternate project name                     |
| ` --pull `             |                         | Always attempt to pull a newer version of the project |
| ` --tag, -t `          | `latest`                | Specify the project tag to use                        |
| ` --version, -v `      |                         | Print version information and quit                    |

## Child commands

| Command                                | Description                              |
| :------------------------------------- | :--------------------------------------- |
| [` docker inaccel config `](config.md) | Validate and view the config file        |
| [` docker inaccel down `](down.md)     | Stop and remove containers and networks  |
| [` docker inaccel exec `](exec.md)     | Execute a command in a running container |
| [` docker inaccel logs `](logs.md)     | View output from containers              |
| [` docker inaccel ps `](ps.md)         | List containers                          |
| [` docker inaccel run `](run.md)       | Run a one-off command                    |
| [` docker inaccel up `](up.md)         | Create and start containers              |
