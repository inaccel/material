---
title: Scalable, Portable and Distributed Gradient Boosting
---

# Scalable, Portable and Distributed Gradient Boosting

*![time/embed](Estimated reading time: {X})*

[![keras](img/xgboost.png){: .center}](https://xgboost.ai)

[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/xgboost)
[![pypi](https://img.shields.io/static/v1?logo=PyPI&color=3775a9&label=PyPI&message=Package&style=for-the-badge)](https://test.pypi.org/project/inaccel-xgboost)

## How to install

```bash
pip install --extra-index-url https://test.pypi.org/simple inaccel-xgboost
```

### FPGA Platforms

Get the available accelerators for your platform.

=== "AWS-VU9P-F1"

	> *xilinx dynamic_5.0*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic_5.0/com/inaccel/xgboost/0.1/2exact
	```

=== "U250"

	> *xilinx xdma_201830.2*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/com/inaccel/xgboost/0.2/4exact
	```

## Examples

#### Get Started with XGBoost

This is a quick start tutorial for you to quickly try out XGBoost on the demo
dataset on a classification task.

```python
import xgboost as xgb

from sklearn.datasets import fetch_openml
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import Normalizer
from timeit import default_timer as timestamp

X, y = fetch_openml('SVHN', return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35)

features = Normalizer()
X_train = features.fit_transform(X_train)
X_test = features.transform(X_test)

label = LabelEncoder()
y_train = label.fit_transform(y_train)
y_test = label.transform(y_test)

params = {
    'alpha': 0.0,
    'eta': 0.3,
    'max_depth': 10,
    'num_class': len(label.classes_),
    'objective': 'multi:softmax',
    'subsample': 1.0,
    'tree_method': 'fpga_exact'
}

dtrain = xgb.DMatrix(X_train, y_train)
dtest = xgb.DMatrix(X_test, y_test)

begin = timestamp()
model = xgb.train(params, dtrain, 10)
end = timestamp()

print('time=%.3f' % (end - begin))

predictions = model.predict(dtest)

print('accuracy=%.3f' % accuracy_score(y_test, predictions))
```
