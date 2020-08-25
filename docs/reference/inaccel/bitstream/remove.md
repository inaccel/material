*![time/embed](Estimated reading time: {X})*

## Description

Remove one or more bitstreams from the local or a remote repository

## Usage

```text
inaccel bitstream remove [command options] <checksums>
```
Where `<checksums>` is the md5 hashes of the bitstream information files that
you are removing.

## Options

| Name, shorthand  | Default   | Description                                       |
| :--------------- | :-------: | :------------------------------------------------ |
| ` --repository ` | ` local ` | Choose the target repository id                   |
| ` --force, -f `  |           | Force the removal of the bitstreams, never prompt |

## Parent command

| Command                             | Description                    |
| :---------------------------------- | :----------------------------- |
| [` inaccel bitstream `](command.md) | Manages bitstream repositories |
