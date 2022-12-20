.. raw:: html

   <a href="https://github.com/lifespline/backlog.git"><img loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=149%2C149" class="attachment-full size-full" alt="Fork Me On Github" data-recalc-dims="1"></a>

=============
Documentation
=============

Docs Structure
--------------

.. code-block::

   ├── docs
   │   ├── sphinx
   │   ├── .nojekyll
   │   ├── _templates
   │   ├── conf.py
   │   ├── index.rst
   │   └── Makefile

Images
------

Images are contained in ``docs/sphinx/static/img/``.

Task Runner
-----------

.. automodule:: tasks
   :members:

Pipeline
--------

The pipeline automates manual build processes like (specifying the AWS profile):

.. code:: bash

   $ inv docs
   $ aws sso login
   $ aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
   $ aws s3 cp --recursive docs s3://backlog-docs
