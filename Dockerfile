# Default values
### $author  // the project owner in github
### $project // the name of the project in github
### $branch  // the branch to checkout
ARG author=poanetwork
ARG project=token-wizard
ARG branch=master

# Docker setup
FROM travisci/ci-garnet:packer-1512502276-986baf0
RUN chmod go-w /usr/local/clang-5.0.0/bin
USER travis
WORKDIR /home/travis/builds
RUN git clone https://github.com/travis-ci/travis-build.git
WORKDIR travis-build
RUN mkdir -p /home/travis/.travis
RUN bash -lc "gem install travis"
RUN bash -lc "travis"
RUN ln -s $(pwd) /home/travis/.travis/travis-build
RUN bash -lc "bundle install"
WORKDIR /home/travis/builds
RUN git clone https://github.com/travis-ci/travis-support.git
WORKDIR travis-support
RUN bash -lc "gem build travis-support.gemspec"
RUN bash -lc "gem install travis-support"
WORKDIR /home/travis/builds
RUN git clone https://github.com/travis-ci/travis-rollout.git
WORKDIR travis-rollout
RUN bash -lc "gem build travis-rollout.gemspec"
RUN bash -lc "gem install travis-rollout"
WORKDIR /home/travis/builds
RUN git clone https://github.com/travis-ci/travis-github_apps.git
WORKDIR travis-github_apps
RUN bash -lc "gem build travis-github_apps.gemspec"
RUN bash -lc "gem install travis-github_apps"

# Repo-related tasks
ARG author
ARG project
ARG branch
RUN mkdir -p /home/travis/builds/$author
WORKDIR /home/travis/builds/$author
RUN git clone -b $branch https://github.com/$author/$project.git
WORKDIR $project
CMD ["bash"]
