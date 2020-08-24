*<small id="time">Estimated reading time: X</small>*

## Description

Start the InAccel Coral container

## Usage

```text
inaccel coral start [command options]
```

## Options

| Name, shorthand   | Default          | Description                                                |
| :---------------- | :--------------: | :--------------------------------------------------------- |
| ` --fpgas `       | ` all `          | Define which FPGAs to handle                               |
| ` --log-level `   | ` exception `    | Define the level of logging events that should be captured |
| ` --https-proxy ` | ` $HTTPS_PROXY ` | Specify a proxy host in the form scheme://hostname:port    |
| ` --tag, -t `     | ` latest `       | Specify the image tag                                      |
| ` --pull `        |                  | Always attempt to pull a newer version of the image        |

## Parent command

| Command                         | Description             |
| :------------------------------ | :---------------------- |
| [` inaccel coral `](command.md) | Manages coral container |
