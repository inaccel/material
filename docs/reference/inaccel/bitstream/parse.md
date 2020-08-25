*![time/embed](Estimated reading time: {X})*

## Description

Parse FPGA binary build-metadata

## Usage

```text
inaccel bitstream parse [command options]
```

## Options

| Name, shorthand  | Default         | Description                                  |
| :--------------- | :-------------: | :------------------------------------------- |
| ` --input, -i `  | ` /dev/stdin `  | The bitstream binary build-metadata source   |
| ` --output, -o ` | ` /dev/stdout ` | The bistream specification target            |
| ` --format `     | ` json `        | Choose the print format between JSON and XML |
| ` --raw `        |                 | Skip field decoration process                |

## Parent command

| Command                             | Description                    |
| :---------------------------------- | :----------------------------- |
| [` inaccel bitstream `](command.md) | Manages bitstream repositories |


## Examples

### Extract the bitstream specification...

* #### ...from an **Intel** binary file (`.aocx`)

```bash
BITSTREAM="binary.aocx" ; (aocl binedit ${BITSTREAM} get .acl.fpga.bin /tmp/fpga.bin && \
aocl binedit /tmp/fpga.bin print .acl.gbs.gz | gunzip | packager gbs-info --gbs=<(cat) && \
rm /tmp/fpga.bin ; aocl binedit ${BITSTREAM} print .acl.kernel_arg_info.xml) | \
	inaccel parse -o bitstream.json
```

* #### ...from a **Xilinx** binary file (`.xclbin`)

```bash
BITSTREAM="binary.xclbin" ; echo -n "BUILD_METADATA CONNECTIVITY IP_LAYOUT" | xargs --delimiter " " --replace \
xclbinutil --input ${BITSTREAM} --dump-section {}:JSON:>(cat) --force &> /dev/null | \
	inaccel parse -o bitstream.json
```
