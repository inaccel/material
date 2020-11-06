*![time/embed](Estimated reading time: {X})*

## Description

Start the InAccel Coral container

## Usage

```text
inaccel coral start [command options]
```

## Options

| Name, shorthand   | Default          | Description                                                |
| :---------------- | :--------------: | :--------------------------------------------------------- |
| ` --attach, -a `  |                  | Attach to STDIN, STDOUT and STDERR                         |
| ` --fpgas `       | ` all `          | Define which FPGA instances to handle                      |
| ` --https-proxy ` | ` $HTTPS_PROXY ` | Specify a proxy host in the form scheme://hostname:port    |
| ` --log-level `   | ` info `         | Define the level of logging events that should be captured |
| ` --tag, -t `     | ` latest `       | Specify the image tag                                      |
| ` --pull `        |                  | Always attempt to pull a newer version of the image        |

## Parent command

| Command                       | Description             |
| :---------------------------- | :---------------------- |
| [` inaccel coral `](index.md) | Manages coral container |
