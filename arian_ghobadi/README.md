## Demo project for Trading Economics
### By Arian Ghobadibigvand - arian.ghb@gmail.com

#### Description
This demo aims to fetch different indicator from Trading Economic's demo APIs (demo account) for two countries and plot their trend.
The project consists of an Angular frontend framework and a Flask based backend framework.

#### Steps to reproduce:
1. clone the repo
2. switch to branch ``arian``
3. Go to backend folder: ``cd arian_ghobadi/backend``
4. To run the Flask project first initialize a py virtual env:
```bash
python3 -m venv ven
source venv/bin/activate
```
5. Then you can install the dependencies and run flask:
```bash
pip install -r requirements.txt
flask run --debug
```
6. After running, take note of which port it serves. for example:
```bash
* Running on http://127.0.0.1:5000
```
7. Go to frontend folder ``cd ../frontend``
8. Install packages ``npm install``
9. Before running Angular server, edit the proxy file at ``src/proxy.conf.json``, replace the ``target`` value with the flask server address. example:
```json
{
    "/api": {
        //change this
      "target": "http://localhost:5000",
      "secure": false
    }
}
```
10. If you've install Angular CLI globally you can use ``ng serve`` command directly, otherwise you can use ``npx ng serve``.

#### Some Remarks
1. Since backend and frontend codes use different languages, for convenience, I developed the frontend code separately and then copied it to the repository's directory. So you don't see much related commits for frontend in the git tree.

2. The code still has some bugs. If you were satisfied with the initial results, I can improve it.

3. I developed the code in my spare time (I have a part-time job) so it took some time.

4. Angular v17 automatic initialization deploys the new standalone component paradigm and explicit imports, so it took me some time to adapt and develop accordingly.