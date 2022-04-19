---
title: High-performance TensorFlow library for quantitative finance.
---

# High-performance TensorFlow library for quantitative finance.

*![time/embed](Estimated reading time: {X})*

[![tensorflow](img/tensorflow.png){: .center}](https://tensorflow.org)

[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/tf-quant-finance)
[![pypi](https://img.shields.io/static/v1?logo=PyPI&color=3775a9&label=PyPI&message=Package&style=for-the-badge)](https://pypi.org/project/inaccel-tf-quant-finance)

## How to install

```bash
pip install inaccel-tf-quant-finance
```

### FPGA Platforms

Get the available accelerators for your platform.

=== "PAC_A10"

	> *intel 38d782e3b6125343b9342433e348ac4c*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/38d782e3b6125343b9342433e348ac4c/com/inaccel/quantitativeFinance/blackScholes/1.0/1binary-price
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/38d782e3b6125343b9342433e348ac4c/com/inaccel/quantitativeFinance/blackScholes/1.0/1option-price
	```

## Examples

#### Black Scholes pricing

Here we see how to price vanilla options in the Black Scholes framework using
the library.

```python
import numpy as np

from inaccel.tf_quant_finance.black_scholes import option_price

# Calculate discount factors (e^-rT)
rate = 0.05
expiries = np.array([0.5, 1.0, 2.0, 1.3])
discount_factors = np.exp(-rate * expiries)

# Current value of assets.
spots = np.array([0.9, 1.0, 1.1, 0.9])

# Forward value of assets at expiry.
forwards = spots / discount_factors

# Strike prices given by:
strikes = np.array([1.0, 2.0, 1.0, 0.5])

# Indicate whether options are call (True) or put (False)
is_call_options = np.array([True, True, False, False])

# The volatilites at which the options are to be priced.
volatilities = np.array([0.7, 1.1, 2.0, 0.5])

# Calculate the prices given the volatilities and term structure.
prices = option_price(
	volatilities=volatilities,
	strikes=strikes,
	expiries=expiries,
	forwards=forwards,
	discount_factors=discount_factors,
	is_call_options=is_call_options)
```
