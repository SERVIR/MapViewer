from flask import Flask
import json
import inspect
from flask import jsonify,request

app = Flask(__name__)

@app.route("/")
def index():
    return "Index!"


@app.route("/listLayers",methods=['GET'])
def listLayers():
    layers_file = inspect.getfile(inspect.currentframe()).replace('urls.py', 'mapviewer.json')
    data = json.load(open(layers_file))
    return_obj = {}
    return_obj["success"] = "success"
    return_obj["data"] = data

    return jsonify(return_obj)

@app.route("/modifyLayer/",methods=['GET','POST'])
def modifyLayer():
    return_obj = {}

    layers_file = inspect.getfile(inspect.currentframe()).replace('urls.py', 'mapviewer.json')

    operation = request.args.get('operation')
    layerObj = json.loads(request.args.get("layerObj"))

    if operation == "update":
        try:
            with open(layers_file, "r+") as json_file:
                json_data = json.load(json_file)
                for i in json_data["layerArray"]:
                    if i["id"] == layerObj["id"]:
                        for key, val in layerObj.iteritems():
                            i[key] = val

                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()
            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)
    if operation == "add":
        try:
            with open(layers_file, "r+") as json_file:
                json_data = json.load(json_file)
                json_data["layerArray"].append(layerObj)
                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()
            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)

    if operation == "delete":
        try:
            with open(layers_file, "r+") as json_file:
                json_data = json.load(json_file)
                for i in json_data["layerArray"]:
                    if i["id"] == layerObj["id"]:
                        json_data["layerArray"].remove(i)
                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()

            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)

    return_obj["operation"] = operation

    return jsonify(return_obj)

@app.route("/checkAdmin/",methods=['GET','POST'])
def checkAdmin():
    return_obj = {}

    email = request.args.get("Email")
    print email

    users_file = inspect.getfile(inspect.currentframe()).replace('urls.py', 'users.json')
    try:
        with open(users_file, "r") as json_file:
            json_data = json.load(json_file)
            for i in json_data["emailArray"]:
                if i["Email"] == email and i["Role"] == 'admin':
                    return_obj["admin"] = True
                else:
                    return_obj["admin"] = False

    except Exception as e:
        return_obj["error"] = "Error processing request" + str(e)

    return jsonify(return_obj)

@app.route("/modifyAdmin/",methods=['GET','POST'])
def modifyAdmin():
    return_obj = {}

    operation = request.args.get("operation")
    emailObj = json.loads(request.args.get("emailObj"))

    users_file = inspect.getfile(inspect.currentframe()).replace('urls.py', 'users.json')

    if operation == "update":
        try:
            with open(users_file,"r+") as json_file:
                json_data = json.load(json_file)
                for i in json_data["emailArray"]:
                    if i["id"] == emailObj["id"]:
                        for key,val in emailObj.iteritems():
                            i[key] = val

                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()
            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)

    if operation == "add":
        try:
            with open(users_file,"r+") as json_file:
                json_data = json.load(json_file)
                json_data["emailArray"].append(emailObj)
                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()
            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)

    if operation == "delete":
        try:
            with open(users_file,"r+") as json_file:
                json_data = json.load(json_file)
                for i in json_data["emailArray"]:
                    if i["id"] == emailObj["id"]:
                        json_data["emailArray"].remove(i)
                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()

            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)

    return_obj["operation"] = operation

    return jsonify(return_obj)


if __name__ == "__main__":
    app.run()
