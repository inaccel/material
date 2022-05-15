---
title: Machine Learning in Python
---

# Machine Learning in Python

*![time/embed](Estimated reading time: {X})*

[![scikit-learn](img/scikit-learn.png){: .center}](https://scikit-learn.org)

[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/scikit-learn)
[![pypi](https://img.shields.io/static/v1?logo=PyPI&color=3775a9&label=PyPI&message=Package&style=for-the-badge)](https://pypi.org/project/inaccel-scikit-learn)

## How to install

```bash
pip install inaccel-scikit-learn
```

### FPGA Platforms

Get the available accelerators for your platform.

=== "AWS-VU9P-F1"

	> *xilinx dynamic-shell*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/com/inaccel/ml/KMeans/1.0/4Centroids
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/com/inaccel/ml/KMeans/1.0/4Centroids1
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/com/inaccel/ml/LogisticRegression/1.0/4Gradients
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/com/inaccel/ml/NaiveBayes/1.0/4Classifier
	```

=== "PAC_A10"

	> *intel 9926ab6d6c925a68aabca7d84c545738*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/9926ab6d6c925a68aabca7d84c545738/com/inaccel/ml/KMeans/1.0/1Centroids
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/9926ab6d6c925a68aabca7d84c545738/com/inaccel/ml/LogisticRegression/1.0/1Gradients
	```

=== "U200"

	> *xilinx xdma_201820.1*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201820.1/com/inaccel/ml/KMeans/1.0/4Centroids
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201820.1/com/inaccel/ml/KMeans/1.0/4Centroids1
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201820.1/com/inaccel/ml/LogisticRegression/1.0/4Gradients
	```

=== "U250"

	> *xilinx xdma_201830.2*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/com/inaccel/ml/KMeans/1.0/4Centroids
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/com/inaccel/ml/KMeans/1.0/4Centroids1
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/com/inaccel/ml/LogisticRegression/1.0/4Gradients
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/com/inaccel/ml/NaiveBayes/1.0/4Classifier
	```

=== "U280"

	> *xilinx xdma_201920.3*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u280/xdma_201920.3/com/inaccel/ml/NaiveBayes/1.0/4Classifier
	```

## Examples

#### MNIST classification using multinomial Logistic Regression

Here we fit a multinomial Logistic Regression on a subset of the MNIST digits
classification task. Test accuracy reaches > 0.9.

```python
from sklearn.datasets import fetch_openml
from inaccel.sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from timeit import default_timer as timestamp

X, y = fetch_openml('mnist_784', return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(X, y)

features = StandardScaler()
X_train = features.fit_transform(X_train)
X_test = features.transform(X_test)

label = LabelEncoder()
y_train = label.fit_transform(y_train)
y_test = label.transform(y_test)

begin = timestamp()
model = LogisticRegression().fit(X_train, y_train)
end = timestamp()

print('time=%.3f' % (end - begin))

predictions = model.predict(X_test)

print('accuracy=%.3f' % accuracy_score(y_test, predictions))
```
