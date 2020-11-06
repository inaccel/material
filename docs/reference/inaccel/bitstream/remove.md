*![time/embed](Estimated reading time: {X})*

## Description

Remove one or more bitstreams from the local or a remote repository

## Usage

```text
inaccel bitstream remove [command options] <checksum>...
```
Where `<checksum>` is the md5 hash of the bitstream information file that you are removing.

## Options

| Name, shorthand  | Default   | Description                                       |
| :--------------- | :-------: | :------------------------------------------------ |
| ` --repository ` | ` local ` | Choose the target repository id                   |
| ` --force, -f `  |           | Force the removal of the bitstreams, never prompt |

## Parent command

| Command                           | Description                    |
| :-------------------------------- | :----------------------------- |
| [` inaccel bitstream `](index.md) | Manages bitstream repositories |
