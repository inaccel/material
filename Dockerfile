ARG TAG
FROM squidfunk/mkdocs-material:${TAG}

ADD requirements.txt .

RUN pip install -r requirements.txt
