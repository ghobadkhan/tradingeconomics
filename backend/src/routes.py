import os
import requests
from uuid import uuid1
from functools import wraps
from flask import (
    Blueprint,
    request,
    Request,
    session
)

routes = Blueprint('routes', __name__, url_prefix="/api")


@routes.get("/")
def home():
    return {}