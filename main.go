package main

import (
    "net/http"
    "ct-front/routing"
    "github.com/CitadelTechnologies/CT-Client"
)

func main() {
    ctclient.Initialize()

    router := routing.NewRouter()

    http.ListenAndServe(":" + ctclient.Server.DedicatedPort, router)
}