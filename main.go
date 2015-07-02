package main

import (
    "log"
    "net/http"
    "thw-front/routing"
)

func main() {

    router := routing.NewRouter()

    log.Fatal(http.ListenAndServe(":8880", router))
}