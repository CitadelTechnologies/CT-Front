package main

import (
    "net/http"
    "thw-front/routing"
    "os"
)

func main() {

    router := routing.NewRouter()

    port := os.Args[1]

	http.ListenAndServe(":" + port, router)
}