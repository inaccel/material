*![time/embed](Estimated reading time: {X})*

## Description

Start the InAccel Monitor container

## Usage

```text
inaccel monitor start [command options]
```

## Options

| Name, shorthand  | Default    | Description                                         |
| :--------------- | :--------: | :-------------------------------------------------- |
| ` --port, -p `   | ` 80 `     | The Web UI availability port                        |
| ` --tag, -t `    | ` latest ` | Specify the image tag                               |
| ` --pull `       |            | Always attempt to pull a newer version of the image |

## Parent command

| Command                           | Description               |
| :-------------------------------- | :------------------------ |
| [` inaccel monitor `](command.md) | Manages monitor container |
