ARG TAG
FROM squidfunk/mkdocs-material:${TAG}
RUN --mount=source=requirements.txt,target=requirements.txt \
    pip install --no-cache-dir --requirement requirements.txt
