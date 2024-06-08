import tradingeconomics as te
import pandas as pd
from typing import cast
from flask import Blueprint,request

routes = Blueprint('routes', __name__, url_prefix="/api")


@routes.get("/")
def home():
    return {
        "status": "OK",
        "data": "test"
        }

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
            "status": "error",
            "errors": errors
        }, 400

    data_raw:pd.DataFrame = te.getHistoricalData(
        country=[payload["country1"],payload["country2"]],
        indicator=payload["indicators"],initDate='2015-01-01',output_type='df')
    try:
        data =  transform_data(data_raw)
    except:
        return {
            "status": "error",
            "errors": ["Internal server error"]
        }, 500
    return {
        "status":"OK",
        "data":data
    }
    
@routes.get("snapshot")
def snapshot():
    country = request.args.get("country")
    if country:
        data = te.getIndicatorData(country=country)
    else:
        return {
            "status": "error",
            "errors":["missing argument 'country'"]
        }, 400
    
    return {
        "status":"OK",
        "data":data
    }

def transform_data(data_raw:pd.DataFrame):
    data_raw = data_raw.drop(0)
    data_raw.sort_values(by="DateTime",ascending=True,inplace=True)
    data_raw["x"] = None
    data_raw.rename(columns={"Value":"y"},inplace=True)
    data = []
    for frequency in data_raw["Frequency"].unique():
        if frequency == "Yearly":
            data_raw.loc[data_raw["Frequency"] == frequency,"x"] = \
                data_raw.loc[data_raw["Frequency"] == frequency,"DateTime"]\
                    .apply(lambda d: pd.to_datetime(d).strftime("%Y"))
        else:
            data_raw.loc[data_raw["Frequency"] == frequency,"x"] = \
                data_raw.loc[data_raw["Frequency"] == frequency,"DateTime"]\
                    .apply(lambda d: pd.to_datetime(d).strftime("%Y-%m")) # type: ignore

    for cat_id,category in enumerate(data_raw["Category"].unique()):
        freq = data_raw["Frequency"].unique().tolist()
        info = {
            "id": cat_id,
            "indicator": category,
            "frequency": freq,
            "axes": {
                "x": "Date",
                "y": "Value"
            }
        }
        datasets = []
        for data_id,country in enumerate(data_raw["Country"].unique()):
            datasets.append(
                {
                    "id":data_id,
                    "label": country,
                    "data": data_raw.loc[(data_raw["Country"] == country) &\
                                (data_raw["Category"] == category),["x","y"]].to_dict(orient="records")
                }
            )
        info["datasets"] = datasets
        data.append(info)
    return data