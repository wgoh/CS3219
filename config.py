import os

class Config(object):
  DEBUG = False
  TESTING = False
  CSRF_ENABLED = True
  SECRET_KEY = 'this-really-needs-to-be-changed'
  SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:@localhost/mydatabase'