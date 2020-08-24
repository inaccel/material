---
title: Deep Learning for humans
---

# Deep Learning for humans

*<small id="time">Estimated reading time: X</small>*

[![keras](/img/keras.png){: .center}](https://keras.io)

[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/keras)
[![pypi](https://img.shields.io/static/v1?logo=PyPI&color=3775a9&label=PyPI&message=Package&style=for-the-badge)](https://pypi.org/project/inaccel-keras)

## How to install

```bash
pip install inaccel-keras
```

### FPGA Platforms

Get the available accelerators for your platform.

=== "U250"

	> *xilinx xdma_201830.2*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/xilinx/com/researchlabs/1.1/1resnet50
	```

=== "U280"

	> *xilinx xdma_201920.3*

	```bash
	```

## Examples

#### Classify ImageNet classes with ResNet50

Weights are downloaded automatically when instantiating a model. They are stored
at `~/.keras/inaccel/models/`.

```python
import time

from inaccel.keras.applications.resnet50 import ResNet50
from inaccel.keras.preprocessing.image import ImageDataGenerator

model = ResNet50(weights='imagenet')

data = ImageDataGenerator(dtype='int8')
images = data.flow_from_directory('imagenet/', target_size=(224, 224), class_mode=None, batch_size=64)

begin = time.monotonic()
preds = model.predict(images, workers=16)
end = time.monotonic()

print('Duration for', len(preds), 'images: %.3f sec' % (end - begin))
print('FPS: %.3f' % (len(preds) / (end - begin)))
```

---

```python
import numpy as np

from inaccel.keras.applications.resnet50 import decode_predictions, ResNet50
from inaccel.keras.preprocessing.image import load_img

model = ResNet50(weights='imagenet')

dog = load_img('data/dog.jpg', target_size=(224, 224))
dog = np.expand_dims(dog, axis=0)

elephant = load_img('data/elephant.jpg', target_size=(224, 224))
elephant = np.expand_dims(elephant, axis=0)

images = np.vstack([dog, elephant])

preds = model.predict(images)

print('Predicted:', decode_predictions(preds, top=1))
```
