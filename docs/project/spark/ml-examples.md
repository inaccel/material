*![time/embed](Estimated reading time: {X})*

The following application examples demonstrate how to accelerate your Spark ML
pipelines, seamlessly.

Resources:

* [Machine Learning Library (MLlib) Guide](https://spark.apache.org/docs/latest/ml-guide.html)
* [Submitting Applications](https://spark.apache.org/docs/latest/submitting-applications.html)

## Datasets

The datasets are stored in the popular LibSVM format. Our datasets are vectors
of pixels representing images of handwritten letters/digits.


> **Load datasets into target file system**

> The datasets will be read in from `inaccel-demo` s3 bucket.

---

![picture](/img/letters.png){: .center}

=== "locally"

	```bash
	${INACCEL_HOME}/bin/load-demo-data-file nist/letters_libsvm_train.dat
	${INACCEL_HOME}/bin/load-demo-data-file nist/letters_libsvm_test.dat
	```

=== "in a cluster"

	```bash
	${INACCEL_HOME}/bin/load-demo-data-hdfs nist/letters_libsvm_train.dat
	${INACCEL_HOME}/bin/load-demo-data-hdfs nist/letters_libsvm_test.dat
	```

---

![picture](/img/mnist8m.png){: .center}

=== "locally"

	```bash
	${INACCEL_HOME}/bin/load-demo-data-file nist/mnist8m_libsvm.dat
	```

=== "in a cluster"

	```bash
	${INACCEL_HOME}/bin/load-demo-data-hdfs nist/mnist8m_libsvm.dat
	```

## Logistic Regression

```text
Usage: LogisticRegressionExample [options] trainSet testSet

  trainSet                 Input path to train dataset (in libsvm format).
  testSet                  Input path to test dataset (in libsvm format).
  --numFeatures <value>    Number of features.
  --elasticNetParam <value>
                           ElasticNet parameter. (Default: 0.5)
  --maxIter <value>        Maximum number of iterations. (Default: 100)
  --tol <value>            The convergence tolerance of iterations. Smaller value will lead to better accuracy with the cost of more iterations. (Default: 1.0E-6)
```

You can read more about Logistic Regression from the
[classification and regression](https://spark.apache.org/docs/latest/ml-classification-regression.html)
section of MLlib Programming Guide.

### Handwritten Letters classification Example (letters 380MB)

![{LabelIndexer - FeaturesScaler - LogisticRegression} Pipeline](/img/lr.png){: .center}

> **Run LogisticRegression Application**
> [[src](https://bitbucket.org/inaccel/release/src/master/examples/spark/src/main/scala/org/apache/spark/examples/inaccel/ml/LogisticRegressionExample.scala)]

!!! info "For a non-accelerated execution ommit `--inaccel`."

=== "locally"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master local[*] \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.LogisticRegressionExample \
		file://${INACCEL_HOME}/data/nist/letters_libsvm_train.dat \
		file://${INACCEL_HOME}/data/nist/letters_libsvm_test.dat \
		--numFeatures 784
	```

=== "in a cluster"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master spark://$(hostname):7077 \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.LogisticRegressionExample \
		hdfs:///inaccel/data/nist/letters_libsvm_train.dat \
		hdfs:///inaccel/data/nist/letters_libsvm_test.dat \
		--numFeatures 784
	```

### Handwritten Digits classification Example (mnist8m 24GB)

![{LabelIndexer - FeaturesScaler - LogisticRegression} Pipeline](/img/lr.png){: .center}

> **Run LogisticRegression Application**
> [[src](https://bitbucket.org/inaccel/release/src/master/examples/spark/src/main/scala/org/apache/spark/examples/inaccel/ml/LogisticRegressionExample.scala)]

!!! info "For a non-accelerated execution ommit `--inaccel`."

=== "locally"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master local[*] \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.LogisticRegressionExample \
		file://${INACCEL_HOME}/data/nist/mnist8m_libsvm.dat \
		file://${INACCEL_HOME}/data/nist/mnist8m_libsvm.dat \
		--numFeatures 784
	```

=== "in a cluster"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master spark://$(hostname):7077 \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.LogisticRegressionExample \
		hdfs:///inaccel/data/nist/mnist8m_libsvm.dat \
		hdfs:///inaccel/data/nist/mnist8m_libsvm.dat \
		--numFeatures 784
	```

## K-Means

```text
Usage: KMeansExample [options] trainSet testSet

  trainSet               Input path to train dataset (in libsvm format).
  testSet                Input path to test dataset (in libsvm format).
  --numFeatures <value>  Number of features.
  --K <value>            K parameter. (Default: 64)
  --maxIter <value>      Maximum number of iterations. (Default: 100)
  --tol <value>          The convergence tolerance of iterations. Smaller value will lead to better distance with the cost of more iterations. (Default: 1.0E-6)
```

You can read more about K-Means from the
[clustering](https://spark.apache.org/docs/latest/ml-clustering.html) section of
MLlib Programming Guide.

### Handwritten Letters clustering Example (letters 380MB)

![{Features Scaler - K-Means} Pipeline](/img/km.png){: .center}

> **Run KMeans Application**
> [[src](https://bitbucket.org/inaccel/release/src/master/examples/spark/src/main/scala/org/apache/spark/examples/inaccel/ml/KMeansExample.scala)]

!!! info "For a non-accelerated execution ommit `--inaccel`."

=== "locally"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master local[*] \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.KMeansExample \
		file://${INACCEL_HOME}/data/nist/letters_libsvm_train.dat \
		file://${INACCEL_HOME}/data/nist/letters_libsvm_test.dat \
		--numFeatures 784
	```

=== "in a cluster"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master spark://$(hostname):7077 \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.KMeansExample \
		hdfs:///inaccel/data/nist/letters_libsvm_train.dat \
		hdfs:///inaccel/data/nist/letters_libsvm_test.dat \
		--numFeatures 784
	```

### Handwritten Digits clustering Example (mnist8m 24GB)

![{Features Scaler - K-Means} Pipeline](/img/km.png){: .center}

> **Run KMeans Application**
> [[src](https://bitbucket.org/inaccel/release/src/master/examples/spark/src/main/scala/org/apache/spark/examples/inaccel/ml/KMeansExample.scala)]

!!! info "For a non-accelerated execution ommit `--inaccel`."

=== "locally"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master local[*] \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.KMeansExample \
		file://${INACCEL_HOME}/data/nist/mnist8m_libsvm.dat \
		file://${INACCEL_HOME}/data/nist/mnist8m_libsvm.dat \
		--numFeatures 784
	```

=== "in a cluster"

	```bash
	${SPARK_HOME}/bin/run-example \
		--inaccel \
		--master spark://$(hostname):7077 \
		--driver-memory 80g \
		--executor-memory 10g \
		--jars ${INACCEL_SPARK_EXAMPLES} \
		inaccel.ml.KMeansExample \
		hdfs:///inaccel/data/nist/mnist8m_libsvm.dat \
		hdfs:///inaccel/data/nist/mnist8m_libsvm.dat \
		--numFeatures 784
	```
