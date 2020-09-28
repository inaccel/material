ARG TAG
FROM squidfunk/mkdocs-material:${TAG}

ADD requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
