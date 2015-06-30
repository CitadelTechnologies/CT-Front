package main

import (
    "log"
    "net/http"
    "8thw-front/routing"
)

func main() {

    router := routing.NewRouter()

    log.Fatal(http.ListenAndServe(":80", router))
}