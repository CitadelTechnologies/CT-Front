package main

import (
    "net/http"
    "thw-front/routing"
    gs "github.com/Kern046/GleipnirServer"
)

func main() {

    gs.Initialize()

    router := routing.NewRouter()

    http.ListenAndServe(":" + gs.Server.DedicatedPort, router)
}