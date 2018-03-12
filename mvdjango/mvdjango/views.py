from django.http import JsonResponse
from django.http import HttpResponse
import json
import inspect

def listLayers(request):
    layers_file = inspect.getfile(inspect.currentframe()).replace('views.py', 'mapviewer.json')
    data = json.load(open(layers_file))
    return_obj = {}
    return_obj["success"] = "success"
    return_obj["data"] = data
    return JsonResponse(return_obj)

def modifyLayer(request):
    return_obj = {}

    operation = request.GET["operation"]
    layerObj = json.loads(request.GET["layerObj"])

    layers_file = inspect.getfile(inspect.currentframe()).replace('views.py', 'mapviewer.json')

    if operation == "update":
        try:
            with open(layers_file,"r+") as json_file:
                json_data = json.load(json_file)
                for i in json_data["layerArray"]:
                    if i["id"] == layerObj["id"]:
                        for key,val in layerObj.iteritems():
                            i[key] = val

                json_file.seek(0)  # rewind
                json.dump(json_data, json_file)
                json_file.truncate()
            return_obj["success"] = "success"
        except Exception as e:
            return_obj["error"] = "Error processing request" + str(e)
    if operation == "add":
        try:
            with open(layers_file,"r+") as json_file:
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
            with open(layers_file,"r+") as json_file:
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
    return JsonResponse(return_obj)

def checkAdmin(request):
    return_obj = {}

    email = request.GET["Email"]

    users_file = inspect.getfile(inspect.currentframe()).replace('views.py', 'users.json')
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

    return JsonResponse(return_obj)

def modifyAdmin(request):
    return_obj = {}

    operation = request.GET["operation"]
    emailObj = json.loads(request.GET["emailObj"])

    users_file = inspect.getfile(inspect.currentframe()).replace('views.py', 'users.json')

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

    return JsonResponse(return_obj)