*![time/embed](Estimated reading time: {X})*

## Description

Install a bitstream to the local or a remote repository, from a local or a
remote source

## Usage

```text
inaccel bitstream install [command options] [<directory>]
```
Where `<directory>` is the path to the bitstream directory source, defaults to
the current directory.

## Options

| Name, shorthand    | Default   | Description                                                                      |
| :----------------- | :-------: | :------------------------------------------------------------------------------- |
| ` --repository `   | ` local ` | Choose the target repository id                                                  |
| ` --mode, -m `     | ` user `  | Set access rights (if target is the local repository): [u]ser, [g]roup, [o]thers |
| ` --user, -u `     |           | Specify the user for both FTP and HTTP file retrieval                            |
| ` --password, -p ` |           | Specify the password for both FTP and HTTP file retrieval                        |

## Parent command

| Command                           | Description                    |
| :-------------------------------- | :----------------------------- |
| [` inaccel bitstream `](index.md) | Manages bitstream repositories |
