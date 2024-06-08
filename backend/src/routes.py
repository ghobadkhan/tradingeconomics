import os
import requests
from typing import cast
import tradingeconomics as te
from uuid import uuid1
from functools import wraps
from flask import (
    Blueprint,
    request,
    Request,
    session
)
import pandas as pd

routes = Blueprint('routes', __name__, url_prefix="/api")


@routes.get("/")
def home():
    return {"result":"hello"}

@routes.post("compare")
def compare_data():
    payload:dict = cast(dict,request.json)
    errors = []
    for k in ["country1","country2","indicators"]:
        v = payload.get(k)
        if not v or len(v) < 1:
            errors.append(f"Missing or malformed input: {k}")
    if len(errors) > 0:
        return {
            "errors": errors
        } , 400

    data:pd.DataFrame = te.getHistoricalData(
        country=[payload["country1"],payload["country2"]],
        indicator=payload["indicators"],initDate='2015-01-01',output_type='df')
    return {"status":"OK"}
    

@routes.get("snapshot")
def snapshot():
    country = request.args.get("country")
    if country:
        data = te.getIndicatorData(country=country)
    else:
        return {"error":"missing argument 'country'"},404
    
    return data