FROM google/cloud-sdk:300.0.0

RUN apt-get -q update && \
    apt-get install -yq --no-install-recommends gettext-base=0.19.8.1-10 && \
    rm -rf /var/lib/apt/lists/*
